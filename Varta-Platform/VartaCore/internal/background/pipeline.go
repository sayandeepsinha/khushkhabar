package background

import (
	"context"
	"encoding/json"
	"encoding/xml"
	"fmt"
	"io"
	"net/http"
	"time"

	"vartacore/VartaCore/internal/cache"
	"vartacore/VartaCore/internal/dbactivity"
	"vartacore/VartaCore/internal/processing"
	"vartacore/shared/common"
	"vartacore/shared/logger"
)

// RunPipeline runs the ingestion, deduplication, scoring, and storage pipeline
func (w *Worker) RunPipeline(ctx context.Context) {
	logger.Info("Starting scheduled news ingestion cycle...")
	newArticlesCount := 0

	// 1. Fetch and process RSS feeds
	for _, feedURL := range w.cfg.RSSFeeds {
		count, err := w.processFeed(ctx, feedURL)
		if err != nil {
			logger.Error("Error fetching feed %s: %v", feedURL, err)
			continue
		}
		newArticlesCount += count
	}

	// 2. Fetch external News API if key is provided
	if w.cfg.NewsAPIKey != "" {
		count, err := w.processNewsAPI(ctx)
		if err != nil {
			logger.Error("Error fetching News API: %v", err)
		} else {
			newArticlesCount += count
		}
	}

	logger.Info("Ingestion cycle complete. Stored %d new positive articles.", newArticlesCount)

	// Invalidate and refresh cache if new articles were added
	if newArticlesCount > 0 {
		_ = w.cache.Delete(ctx, cache.KeyFeaturedArticle, cache.KeyBestArticles, cache.KeyCategories)
		_ = w.cache.FlushPattern(ctx, "articles:*")
		logger.Info("Refreshed article and category caches")
	}
}

func (w *Worker) processFeed(ctx context.Context, feedURL string) (int, error) {
	req, err := http.NewRequestWithContext(ctx, "GET", feedURL, nil)
	if err != nil {
		return 0, err
	}
	req.Header.Set("User-Agent", "Varta-NewsBot/1.0 (+https://varta.news)")

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return 0, fmt.Errorf("unexpected status %d", resp.StatusCode)
	}

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return 0, err
	}

	// Try RSS 2.0 first
	var rss rssFeed
	if err := xml.Unmarshal(data, &rss); err == nil && len(rss.Channel.Items) > 0 {
		sourceName := rss.Channel.Title
		if sourceName == "" {
			sourceName = extractDomain(feedURL)
		}
		return w.ingestRSSItems(ctx, rss.Channel.Items, sourceName)
	}

	// Try Atom
	var atom atomFeed
	if err := xml.Unmarshal(data, &atom); err == nil && len(atom.Entries) > 0 {
		sourceName := atom.Title
		if sourceName == "" {
			sourceName = extractDomain(feedURL)
		}
		return w.ingestAtomEntries(ctx, atom.Entries, sourceName)
	}

	return 0, fmt.Errorf("could not parse XML as RSS 2.0 or Atom")
}

// processNewsAPI fetches from external News API if configured
func (w *Worker) processNewsAPI(ctx context.Context) (int, error) {
	endpoint := fmt.Sprintf("%s?apikey=%s&q=breakthrough+OR+renewable+OR+recovery&language=en", w.cfg.NewsAPIEndpoint, w.cfg.NewsAPIKey)
	req, err := http.NewRequestWithContext(ctx, "GET", endpoint, nil)
	if err != nil {
		return 0, err
	}

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()

	var apiData struct {
		Results []struct {
			Title       string `json:"title"`
			Link        string `json:"link"`
			Description string `json:"description"`
			Content     string `json:"content"`
			ImageURL    string `json:"image_url"`
			SourceName  string `json:"source_id"`
			PubDate     string `json:"pubDate"`
		} `json:"results"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&apiData); err != nil {
		return 0, err
	}

	count := 0
	for _, item := range apiData.Results {
		if item.Title == "" || item.Link == "" {
			continue
		}
		exists, _ := w.repo.ArticleExistsByUrlOrTitle(ctx, item.Link, item.Title)
		if exists {
			continue
		}

		processed := processing.ProcessArticle(
			item.Title,
			item.Description,
			item.Content,
			item.Link,
			item.SourceName,
			item.SourceName,
			formatPubDate(item.PubDate),
			item.ImageURL,
			w.cfg.GeminiAPIKey,
		)

		if !processed.IsPositive || processed.PositivityScore < 70 {
			continue
		}

		art := &dbactivity.Article{
			ID:                 common.GenerateID("art-"),
			Title:              processed.Title,
			Summary:            processed.Summary,
			Content:            processed.Content,
			Category:           processed.Category,
			CategorySlug:       processed.CategorySlug,
			ImageURL:           processed.ImageURL,
			SourceName:         processed.SourceName,
			SourceURL:          processed.SourceURL,
			Author:             processed.Author,
			PublishedAt:        processed.PublishedAt,
			ReadingTimeMinutes: processed.ReadingTimeMinutes,
			PositivityScore:    processed.PositivityScore,
			UpliftBadge:        processed.UpliftBadge,
			IsFeatured:         processed.IsFeatured,
			IsBestOfWeek:       processed.IsBestOfWeek,
			Status:             "published",
			CreatedAt:          time.Now(),
		}

		if err := w.repo.SaveArticle(ctx, art); err == nil {
			count++
		}
	}

	return count, nil
}

package background

import (
	"context"
	"encoding/json"
	"encoding/xml"
	"fmt"
	"io"
	"net/http"
	"regexp"
	"strings"
	"time"

	"vartacore/VartaCore/internal/cache"
	"vartacore/VartaCore/internal/config"
	"vartacore/VartaCore/internal/dbactivity"
	"vartacore/VartaCore/internal/processing"
	"vartacore/shared/common"
	"vartacore/shared/logger"
)

var (
	htmlImgRegex  = regexp.MustCompile(`(?i)<img[^>]+src=["'](https?://[^"'\s>]+)["']`)
	ogImgRegex    = regexp.MustCompile(`(?i)<meta[^>]+property=["']og:image["'][^>]+content=["'](https?://[^"'\s>]+)["']`)
	ogImgAltRegex = regexp.MustCompile(`(?i)<meta[^>]+content=["'](https?://[^"'\s>]+)["'][^>]+property=["']og:image["']`)
)

// RSS XML Data Structures
type rssFeed struct {
	XMLName xml.Name   `xml:"rss"`
	Channel rssChannel `xml:"channel"`
}

type rssChannel struct {
	Title string    `xml:"title"`
	Items []rssItem `xml:"item"`
}

type rssItem struct {
	Title        string       `xml:"title"`
	Link         string       `xml:"link"`
	Description  string       `xml:"description"`
	Content      string       `xml:"encoded"`
	PubDate      string       `xml:"pubDate"`
	Creator      string       `xml:"creator"`
	Author       string       `xml:"author"`
	Enclosure    rssEnclosure `xml:"enclosure"`
	MediaContent rssMedia     `xml:"http://search.yahoo.com/mrss/ content"`
	MediaThumb   rssThumbnail `xml:"http://search.yahoo.com/mrss/ thumbnail"`
	ContentMedia rssMedia     `xml:"content"`
	ThumbMedia   rssThumbnail `xml:"thumbnail"`
}

type rssEnclosure struct {
	URL  string `xml:"url,attr"`
	Type string `xml:"type,attr"`
}

type rssMedia struct {
	URL string `xml:"url,attr"`
}

type rssThumbnail struct {
	URL string `xml:"url,attr"`
}

// Atom XML structures
type atomFeed struct {
	XMLName xml.Name    `xml:"feed"`
	Title   string      `xml:"title"`
	Entries []atomEntry `xml:"entry"`
}

type atomEntry struct {
	Title     string     `xml:"title"`
	Link      atomLink   `xml:"link"`
	Summary   string     `xml:"summary"`
	Content   string     `xml:"content"`
	Published string     `xml:"published"`
	Author    atomAuthor `xml:"author"`
}

type atomLink struct {
	Href string `xml:"href,attr"`
}

type atomAuthor struct {
	Name string `xml:"name"`
}

// Worker handles background news ingestion
type Worker struct {
	cfg   *config.Config
	repo  dbactivity.Repository
	cache cache.Cacher
}

func NewWorker(cfg *config.Config, repo dbactivity.Repository, c cache.Cacher) *Worker {
	return &Worker{
		cfg:   cfg,
		repo:  repo,
		cache: c,
	}
}

// Start launches the background scheduler
func (w *Worker) Start(ctx context.Context) {
	logger.Info("Starting VartaCore background news worker (Interval: %v)", w.cfg.NewsFetchInterval)

	// Run initial ingestion asynchronously on startup
	go func() {
		time.Sleep(1 * time.Second)
		w.RunPipeline(ctx)
	}()

	ticker := time.NewTicker(w.cfg.NewsFetchInterval)
	go func() {
		defer ticker.Stop()
		for {
			select {
			case <-ctx.Done():
				logger.Info("Stopping VartaCore news worker...")
				return
			case <-ticker.C:
				w.RunPipeline(ctx)
			}
		}
	}()
}

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

func (w *Worker) ingestRSSItems(ctx context.Context, items []rssItem, sourceName string) (int, error) {
	count := 0
	for _, item := range items {
		title := strings.TrimSpace(item.Title)
		link := strings.TrimSpace(item.Link)
		if title == "" || link == "" {
			continue
		}

		// Deduplication
		// Extract image using enhanced RSS / HTML / OpenGraph extraction
		imageURL := extractImageFromRSS(&item)
		if imageURL == "" {
			imageURL = extractOGImage(link)
		}

		// Deduplication & In-place repair for existing articles with fallback/robot images
		exists, err := w.repo.ArticleExistsByUrlOrTitle(ctx, link, title)
		if err == nil && exists {
			if imageURL != "" {
				_ = w.repo.UpdateArticleImageIfFallback(ctx, link, title, imageURL)
			}
			continue
		}

		author := item.Creator
		if author == "" {
			author = item.Author
		}

		// Score and process article
		processed := processing.ProcessArticle(
			item.Title,
			item.Description,
			item.Content,
			link,
			sourceName,
			author,
			formatPubDate(item.PubDate),
			imageURL,
			w.cfg.GeminiAPIKey,
		)

		if !processed.IsPositive || processed.PositivityScore < 70 {
			continue // Filter out non-positive stories
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

func (w *Worker) ingestAtomEntries(ctx context.Context, entries []atomEntry, sourceName string) (int, error) {
	count := 0
	for _, entry := range entries {
		title := strings.TrimSpace(entry.Title)
		link := strings.TrimSpace(entry.Link.Href)
		if title == "" || link == "" {
			continue
		}

		imageURL := extractImageFromAtom(&entry)
		if imageURL == "" {
			imageURL = extractOGImage(link)
		}

		exists, err := w.repo.ArticleExistsByUrlOrTitle(ctx, link, title)
		if err == nil && exists {
			if imageURL != "" {
				_ = w.repo.UpdateArticleImageIfFallback(ctx, link, title, imageURL)
			}
			continue
		}

		processed := processing.ProcessArticle(
			entry.Title,
			entry.Summary,
			entry.Content,
			link,
			sourceName,
			entry.Author.Name,
			formatPubDate(entry.Published),
			imageURL,
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

func formatPubDate(raw string) string {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return "Just now"
	}
	// Try parsing RFC1123, RFC822, RFC3339
	formats := []string{
		time.RFC1123Z,
		time.RFC1123,
		time.RFC822Z,
		time.RFC822,
		time.RFC3339,
		"2006-01-02 15:04:05",
	}
	for _, f := range formats {
		if t, err := time.Parse(f, raw); err == nil {
			diff := time.Since(t)
			if diff < time.Hour {
				return fmt.Sprintf("%d mins ago", int(diff.Minutes()))
			}
			if diff < 24*time.Hour {
				return fmt.Sprintf("%d hours ago", int(diff.Hours()))
			}
			return fmt.Sprintf("%d days ago", int(diff.Hours()/24))
		}
	}
	return raw
}

func extractDomain(feedURL string) string {
	parts := strings.Split(feedURL, "/")
	if len(parts) >= 3 {
		return parts[2]
	}
	return "Global News"
}

func extractImageFromRSS(item *rssItem) string {
	if strings.HasPrefix(item.Enclosure.URL, "http") {
		return item.Enclosure.URL
	}
	if strings.HasPrefix(item.MediaContent.URL, "http") {
		return item.MediaContent.URL
	}
	if strings.HasPrefix(item.MediaThumb.URL, "http") {
		return item.MediaThumb.URL
	}
	if strings.HasPrefix(item.ContentMedia.URL, "http") {
		return item.ContentMedia.URL
	}
	if strings.HasPrefix(item.ThumbMedia.URL, "http") {
		return item.ThumbMedia.URL
	}
	// Extract <img> from Description HTML
	if m := htmlImgRegex.FindStringSubmatch(item.Description); len(m) > 1 {
		return m[1]
	}
	// Extract <img> from Content:encoded HTML
	if m := htmlImgRegex.FindStringSubmatch(item.Content); len(m) > 1 {
		return m[1]
	}
	return ""
}

func extractImageFromAtom(entry *atomEntry) string {
	if m := htmlImgRegex.FindStringSubmatch(entry.Content); len(m) > 1 {
		return m[1]
	}
	if m := htmlImgRegex.FindStringSubmatch(entry.Summary); len(m) > 1 {
		return m[1]
	}
	return ""
}

func extractOGImage(url string) string {
	if url == "" || !strings.HasPrefix(url, "http") {
		return ""
	}
	client := &http.Client{Timeout: 3 * time.Second}
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return ""
	}
	req.Header.Set("User-Agent", "Mozilla/5.0 (compatible; Varta-Bot/1.0)")
	resp, err := client.Do(req)
	if err != nil {
		return ""
	}
	defer resp.Body.Close()
	buf := make([]byte, 32768)
	n, _ := io.ReadFull(resp.Body, buf)
	body := string(buf[:n])
	if m := ogImgRegex.FindStringSubmatch(body); len(m) > 1 {
		return m[1]
	}
	if m := ogImgAltRegex.FindStringSubmatch(body); len(m) > 1 {
		return m[1]
	}
	return ""
}

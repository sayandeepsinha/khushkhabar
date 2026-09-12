package processing

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"html"
	"io"
	"net/http"
	"regexp"
	"strings"
	"time"

	"vartacore/common"
)

// ProcessedResult represents the normalized, scored article
type ProcessedResult struct {
	Title              string
	Summary            string
	Content            string
	Category           string
	CategorySlug       string
	ImageURL           string
	SourceName         string
	SourceURL          string
	Author             string
	PublishedAt        string
	ReadingTimeMinutes int
	PositivityScore    int
	UpliftBadge        string
	IsFeatured         bool
	IsBestOfWeek       bool
	IsPositive         bool
}

var htmlTagRegex = regexp.MustCompile("<[^>]*>")

// StripHTML removes HTML tags and decodes character entities
func StripHTML(input string) string {
	cleaned := htmlTagRegex.ReplaceAllString(input, " ")
	cleaned = html.UnescapeString(cleaned)
	return strings.Join(strings.Fields(cleaned), " ")
}

// Fallback images curated by category from Unsplash
var categoryFallbackImages = map[string][]string{
	"planet": {
		"https://images.unsplash.com/photo-1523848309072-c199db53f137?auto=format&fit=crop&w=1000&q=80",
		"https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=1000&q=80",
		"https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=1000&q=80",
	},
	"science": {
		"https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80",
		"https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80",
		"https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80",
	},
	"kindness": {
		"https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1000&q=80",
		"https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80",
	},
	"health": {
		"https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80",
		"https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1000&q=80",
	},
	"innovation": {
		"https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?auto=format&fit=crop&w=1000&q=80",
		"https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1000&q=80",
	},
	"culture": {
		"https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80",
		"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80",
	},
}

// Category keywords dictionary
var categoryKeywords = map[string][]string{
	"planet": {
		"renewable", "solar", "wind", "ocean", "climate", "whale", "forest", "wildlife", "tree", "carbon", "reef",
		"coral", "conservation", "biodiversity", "species", "earth", "nature", "river", "cleanup",
	},
	"science": {
		"breakthrough", "discovery", "space", "astronomy", "physics", "telescope", "nasa", "quantum", "lab",
		"scientists", "researchers", "galaxy", "satellite", "archaeologists",
	},
	"health": {
		"vaccine", "cancer", "therapy", "clinical trial", "remission", "cure", "medicine", "health", "hospital",
		"disease", "treatment", "cardio", "mental health", "wellness", "diet", "longevity", "immune",
	},
	"innovation": {
		"technology", "bionic", "ai", "artificial intelligence", "robot", "hardware", "open-source", "desalination",
		"engineering", "battery", "electric", "software", "prosthetic", "startup",
	},
	"kindness": {
		"volunteer", "community", "rescued", "hero", "generous", "kindness", "neighbor", "donation", "tuition",
		"children", "school", "heartwarming", "shelter", "compassion", "charity",
	},
	"culture": {
		"arts", "museum", "music", "tradition", "book", "library", "literacy", "culinary", "food kitchen",
		"heritage", "festival", "history", "exhibit",
	},
}

// Category metadata mapping
var categoryDisplay = map[string]string{
	"planet":     "Planet & Climate",
	"science":    "Science & Discovery",
	"kindness":   "Humanity & Kindness",
	"health":     "Health & Wellness",
	"innovation": "Positive Tech",
	"culture":    "Culture & Arts",
}

// ClassifyCategory evaluates the text and returns matching slug & display name
func ClassifyCategory(text string) (slug, name string) {
	lower := strings.ToLower(text)
	scores := make(map[string]int)

	for cat, words := range categoryKeywords {
		for _, w := range words {
			if strings.Contains(lower, w) {
				scores[cat] += 2
			}
		}
	}

	bestCat := "kindness"
	highest := 0
	for cat, score := range scores {
		if score > highest {
			highest = score
			bestCat = cat
		}
	}

	return bestCat, categoryDisplay[bestCat]
}

// ScorePositivity calculates the positivity index (0-100) and badges
func ScorePositivity(title, text string, sourceName string) (score int, badge string, isPositive bool) {
	lower := strings.ToLower(title + " " + text)

	// Hard negative filter: tragedy without solution
	negativeTriggers := []string{"murder", "kill", "massacre", "homicide", "terrorist", "suicide", "crash kills", "dead in fire"}
	for _, neg := range negativeTriggers {
		if strings.Contains(lower, neg) {
			return 40, "Review", false
		}
	}

	// Uplifting keyword weights
	positives := []string{
		"breakthrough", "milestone", "miracle", "triumph", "cured", "recovery", "rescued", "restored",
		"record high", "surpasses", "cleared", "historic", "thriving", "hope", "clean", "sustainable",
		"generous", "saved", "victory", "rebounded", "progress", "uplifting", "first time",
	}

	points := 82 // Baseline optimistic score
	for _, p := range positives {
		if strings.Contains(lower, p) {
			points += 3
		}
	}

	if points > 99 {
		points = 99
	}

	switch {
	case strings.Contains(lower, "milestone") || strings.Contains(lower, "historic"):
		badge = fmt.Sprintf("%d%% Joy Index", points)
	case strings.Contains(lower, "cure") || strings.Contains(lower, "remission") || strings.Contains(lower, "vaccine") || strings.Contains(lower, "ultrasound"):
		badge = "Medical Miracle"
	case strings.Contains(lower, "whale") || strings.Contains(lower, "reef") || strings.Contains(lower, "forest") || strings.Contains(lower, "conservation"):
		badge = "Conservation Triumph"
	case strings.Contains(lower, "volunteer") || strings.Contains(lower, "neighbor") || strings.Contains(lower, "tuition") || strings.Contains(lower, "rescued"):
		badge = "Heartwarming"
	case strings.Contains(lower, "solar") || strings.Contains(lower, "membrane") || strings.Contains(lower, "bionic"):
		badge = "Tech for Good"
	default:
		badge = fmt.Sprintf("%d%% Uplifting", points)
	}

	return points, badge, points >= 75
}

// ResolveImage ensures an image URL exists or selects a curated category fallback
func ResolveImage(givenUrl, categorySlug string) string {
	if givenUrl != "" && (strings.HasPrefix(givenUrl, "http://") || strings.HasPrefix(givenUrl, "https://")) {
		return givenUrl
	}
	fallbacks, ok := categoryFallbackImages[categorySlug]
	if !ok || len(fallbacks) == 0 {
		return "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1000&q=80"
	}
	return fallbacks[int(time.Now().Unix())%len(fallbacks)]
}

// ProcessArticle runs heuristic classification and positivity scoring
func ProcessArticle(rawTitle, rawSummary, rawContent, sourceURL, sourceName, author, publishedAt, imageURL, geminiAPIKey string) *ProcessedResult {
	cleanTitle := StripHTML(rawTitle)
	cleanSummary := StripHTML(rawSummary)
	cleanContent := StripHTML(rawContent)

	if cleanSummary == "" {
		if len(cleanContent) > 280 {
			cleanSummary = cleanContent[:280] + "..."
		} else {
			cleanSummary = cleanContent
		}
	}

	fullText := cleanTitle + " " + cleanSummary + " " + cleanContent
	slug, categoryName := ClassifyCategory(fullText)
	score, badge, isPositive := ScorePositivity(cleanTitle, fullText, sourceName)
	readingTime := common.CalculateReadingTime(fullText)
	finalImage := ResolveImage(imageURL, slug)

	if author == "" {
		author = sourceName
	}
	if publishedAt == "" {
		publishedAt = "Recently"
	}

	result := &ProcessedResult{
		Title:              cleanTitle,
		Summary:            cleanSummary,
		Content:            cleanContent,
		Category:           categoryName,
		CategorySlug:       slug,
		ImageURL:           finalImage,
		SourceName:         sourceName,
		SourceURL:          sourceURL,
		Author:             author,
		PublishedAt:        publishedAt,
		ReadingTimeMinutes: readingTime,
		PositivityScore:    score,
		UpliftBadge:        badge,
		IsFeatured:         score >= 98,
		IsBestOfWeek:       score >= 95,
		IsPositive:         isPositive,
	}

	if geminiAPIKey != "" {
		refineWithGemini(result, geminiAPIKey)
	}

	return result
}

// Optional Gemini LLM enhancement
func refineWithGemini(art *ProcessedResult, apiKey string) {
	ctx, cancel := context.WithTimeout(context.Background(), 2500*time.Millisecond)
	defer cancel()

	url := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=%s", apiKey)
	prompt := fmt.Sprintf(`Analyze this news story for a positive news platform. Return JSON only.
Title: %s
Summary: %s
Format:
{
  "positivity_score": 95,
  "uplift_badge": "Breakthrough",
  "category_slug": "science",
  "is_positive": true
}`, art.Title, art.Summary)

	reqBody, _ := json.Marshal(map[string]any{
		"contents": []map[string]any{
			{"parts": []map[string]any{{"text": prompt}}},
		},
	})

	req, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(reqBody))
	if err != nil {
		return
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil || resp.StatusCode != http.StatusOK {
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	var gResp struct {
		Candidates []struct {
			Content struct {
				Parts []struct {
					Text string `json:"text"`
				} `json:"parts"`
			} `json:"content"`
		} `json:"candidates"`
	}
	if err := json.Unmarshal(body, &gResp); err == nil && len(gResp.Candidates) > 0 && len(gResp.Candidates[0].Content.Parts) > 0 {
		rawJSON := gResp.Candidates[0].Content.Parts[0].Text
		rawJSON = strings.TrimPrefix(strings.TrimSuffix(strings.TrimSpace(rawJSON), "```"), "```json")
		var parsed struct {
			PositivityScore int    `json:"positivity_score"`
			UpliftBadge     string `json:"uplift_badge"`
			CategorySlug    string `json:"category_slug"`
			IsPositive      bool   `json:"is_positive"`
		}
		if json.Unmarshal([]byte(rawJSON), &parsed) == nil {
			if parsed.PositivityScore > 0 {
				art.PositivityScore = parsed.PositivityScore
			}
			if parsed.UpliftBadge != "" {
				art.UpliftBadge = parsed.UpliftBadge
			}
			if catName, ok := categoryDisplay[parsed.CategorySlug]; ok {
				art.CategorySlug = parsed.CategorySlug
				art.Category = catName
			}
			art.IsPositive = parsed.IsPositive
		}
	}
}

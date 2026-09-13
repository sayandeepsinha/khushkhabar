package models

import "time"

// Article model
type Article struct {
	ID                 string    `json:"id"`
	Title              string    `json:"title"`
	Summary            string    `json:"summary"`
	Content            string    `json:"content,omitempty"`
	Category           string    `json:"category"`
	CategorySlug       string    `json:"categorySlug"`
	ImageURL           string    `json:"imageUrl"`
	SourceName         string    `json:"sourceName"`
	SourceURL          string    `json:"sourceUrl,omitempty"`
	Author             string    `json:"author"`
	PublishedAt        string    `json:"publishedAt"`
	ReadingTimeMinutes int       `json:"readingTimeMinutes"`
	PositivityScore    int       `json:"positivityScore"`
	UpliftBadge        string    `json:"upliftBadge,omitempty"`
	IsFeatured         bool      `json:"isFeatured"`
	IsBestOfWeek       bool      `json:"isBestOfWeek"`
	Bookmarked         bool      `json:"bookmarked"`
	Status             string    `json:"status,omitempty"`
	CreatedAt          time.Time `json:"createdAt"`
}

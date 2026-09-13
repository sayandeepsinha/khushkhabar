package models


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

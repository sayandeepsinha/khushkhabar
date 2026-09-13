package models

import "time"

// User model
type User struct {
	ID           string    `json:"id"`
	Name         string    `json:"name"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	AvatarURL    string    `json:"avatarUrl,omitempty"`
	CreatedAt    time.Time `json:"createdAt"`
}


// UserPreferences model
type UserPreferences struct {
	FavoriteCategories     []string `json:"favoriteCategories"`
	PositivityThreshold    int      `json:"positivityThreshold"`
	DailyDigestEmail       bool     `json:"dailyDigestEmail"`
	BreakingGoodNewsAlerts bool     `json:"breakingGoodNewsAlerts"`
	ReadingLayout          string   `json:"readingLayout"`
	QuoteOfTheDay          bool     `json:"quoteOfTheDay"`
}
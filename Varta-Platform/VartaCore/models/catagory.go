package models


// Category model
type Category struct {
	ID           string `json:"id"`
	Name         string `json:"name"`
	Slug         string `json:"slug"`
	IconName     string `json:"iconName"`
	Description  string `json:"description"`
	ArticleCount int    `json:"articleCount"`
}

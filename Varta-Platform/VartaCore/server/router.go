package server

import (
	"net/http"
)

// ArticleHandler defines endpoints for articles
type ArticleHandler interface {
	ListArticles(w http.ResponseWriter, r *http.Request)
	FeaturedArticle(w http.ResponseWriter, r *http.Request)
	BestArticles(w http.ResponseWriter, r *http.Request)
	GetArticle(w http.ResponseWriter, r *http.Request)
	BookmarkArticle(w http.ResponseWriter, r *http.Request)
}

// CategoryHandler defines endpoints for categories
type CategoryHandler interface {
	ListCategories(w http.ResponseWriter, r *http.Request)
}

// UserHandler defines endpoints for user authentication and preferences
type UserHandler interface {
	Login(w http.ResponseWriter, r *http.Request)
	Register(w http.ResponseWriter, r *http.Request)
	Logout(w http.ResponseWriter, r *http.Request)
	GetPreferences(w http.ResponseWriter, r *http.Request)
	UpdatePreferences(w http.ResponseWriter, r *http.Request)
	DeleteAccount(w http.ResponseWriter, r *http.Request)
}

// RouteConfig groups the handlers and options needed to construct the router
type RouteConfig struct {
	ArticleHandler    ArticleHandler
	CategoryHandler   CategoryHandler
	UserHandler       UserHandler
	HealthHandler     http.Handler
	CORSAllowedOrigin string
}

// NewRouter registers all API routes and returns the middleware-wrapped HTTP handler
func NewRouter(cfg RouteConfig) http.Handler {
	mux := http.NewServeMux()

	// 1. Health check endpoint
	if cfg.HealthHandler != nil {
		mux.Handle("GET /api/health", cfg.HealthHandler)
	}

	// 2. Category endpoints
	if cfg.CategoryHandler != nil {
		mux.HandleFunc("GET /api/categories", cfg.CategoryHandler.ListCategories)
	}

	// 3. Article endpoints
	if cfg.ArticleHandler != nil {
		mux.HandleFunc("GET /api/articles", cfg.ArticleHandler.ListArticles)
		mux.HandleFunc("GET /api/articles/featured", cfg.ArticleHandler.FeaturedArticle)
		mux.HandleFunc("GET /api/articles/best", cfg.ArticleHandler.BestArticles)
		mux.HandleFunc("GET /api/articles/{id}", cfg.ArticleHandler.GetArticle)
		mux.HandleFunc("POST /api/articles/{id}/bookmark", cfg.ArticleHandler.BookmarkArticle)
	}

	// 4. Auth & User endpoints
	if cfg.UserHandler != nil {
		mux.HandleFunc("POST /api/auth/login", cfg.UserHandler.Login)
		mux.HandleFunc("POST /api/auth/register", cfg.UserHandler.Register)
		mux.HandleFunc("POST /api/auth/logout", cfg.UserHandler.Logout)
		mux.HandleFunc("GET /api/user/preferences", cfg.UserHandler.GetPreferences)
		mux.HandleFunc("PUT /api/user/preferences", cfg.UserHandler.UpdatePreferences)
		mux.HandleFunc("DELETE /api/user/account", cfg.UserHandler.DeleteAccount)
	}

	// 5. Middleware Pipeline: Recovery -> CORS -> Logging
	handler := RecoveryMiddleware(mux)
	handler = CORSMiddleware(cfg.CORSAllowedOrigin)(handler)
	handler = LoggingMiddleware(handler)

	return handler
}

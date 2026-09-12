package server

import (
	"net/http"
	"time"

	"vartacore/VartaCore/internal/articles"
	"vartacore/VartaCore/internal/cache"
	"vartacore/VartaCore/internal/catagory"
	"vartacore/VartaCore/internal/config"
	"vartacore/VartaCore/internal/dbactivity"
	"vartacore/VartaCore/internal/user"
	"vartacore/common"
)

// APIService wraps the HTTP router and services
type APIService struct {
	cfg             *config.Config
	repo            dbactivity.Repository
	cache           cache.Cacher
	articleHandler  *articles.Handler
	catagoryHandler *catagory.Handler
	userHandler     *user.Handler
	startTime       time.Time
}

// NewAPIService builds handlers and routes
func NewAPIService(
	cfg *config.Config,
	repo dbactivity.Repository,
	c cache.Cacher,
	articleH *articles.Handler,
	catagoryH *catagory.Handler,
	userH *user.Handler,
) *APIService {
	return &APIService{
		cfg:             cfg,
		repo:            repo,
		cache:           c,
		articleHandler:  articleH,
		catagoryHandler: catagoryH,
		userHandler:     userH,
		startTime:       time.Now(),
	}
}

// Router configures and returns the standard net/http handler with all endpoints
func (s *APIService) Router() http.Handler {
	mux := http.NewServeMux()

	// Health check endpoint
	mux.HandleFunc("GET /api/health", s.handleHealth)

	// Category endpoints
	mux.HandleFunc("GET /api/categories", s.catagoryHandler.ListCategories)

	// Article endpoints
	mux.HandleFunc("GET /api/articles", s.articleHandler.ListArticles)
	mux.HandleFunc("GET /api/articles/featured", s.articleHandler.FeaturedArticle)
	mux.HandleFunc("GET /api/articles/best", s.articleHandler.BestArticles)
	mux.HandleFunc("GET /api/articles/{id}", s.articleHandler.GetArticle)
	mux.HandleFunc("POST /api/articles/{id}/bookmark", s.articleHandler.BookmarkArticle)

	// Auth & User endpoints
	mux.HandleFunc("POST /api/auth/login", s.userHandler.Login)
	mux.HandleFunc("POST /api/auth/register", s.userHandler.Register)
	mux.HandleFunc("POST /api/auth/logout", s.userHandler.Logout)
	mux.HandleFunc("GET /api/user/preferences", s.userHandler.GetPreferences)
	mux.HandleFunc("PUT /api/user/preferences", s.userHandler.UpdatePreferences)
	mux.HandleFunc("DELETE /api/user/account", s.userHandler.DeleteAccount)

	// Wrap middleware pipeline: Recovery -> CORS -> Logging
	handler := RecoveryMiddleware(mux)
	handler = CORSMiddleware(s.cfg.CORSAllowedOrigin)(handler)
	handler = LoggingMiddleware(handler)

	return handler
}

func (s *APIService) handleHealth(w http.ResponseWriter, r *http.Request) {
	redisStatus := "connected"
	if !s.cache.IsAvailable() {
		redisStatus = "in-memory-fallback"
	}

	common.WriteJSON(w, http.StatusOK, map[string]any{
		"status":    "healthy",
		"service":   "VartaCore API",
		"version":   "1.0.0",
		"uptime":    time.Since(s.startTime).String(),
		"cache":     redisStatus,
		"timestamp": time.Now().UTC().Format(time.RFC3339),
	})
}

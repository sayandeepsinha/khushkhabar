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
)

// Server defines the core contract for the API service
type Server interface {
	Router() http.Handler
	Config() *config.Config
	StartTime() time.Time
}

// APIService coordinates API handlers, dependencies, and router assembly
type APIService struct {
	cfg             *config.Config
	repo            dbactivity.Repository
	cache           cache.Cacher
	articleHandler  ArticleHandler
	catagoryHandler CategoryHandler
	userHandler     UserHandler
	healthHandler   *HealthHandler
	startTime       time.Time
}

// NewAPIService instantiates the API service with its dependencies
func NewAPIService(
	cfg *config.Config,
	repo dbactivity.Repository,
	c cache.Cacher,
	articleH *articles.Handler,
	catagoryH *catagory.Handler,
	userH *user.Handler,
) *APIService {
	startTime := time.Now()
	return &APIService{
		cfg:             cfg,
		repo:            repo,
		cache:           c,
		articleHandler:  articleH,
		catagoryHandler: catagoryH,
		userHandler:     userH,
		healthHandler:   NewHealthHandler(c, startTime),
		startTime:       startTime,
	}
}

// Router delegates to NewRouter to build and return the configured HTTP handler
func (s *APIService) Router() http.Handler {
	return NewRouter(RouteConfig{
		ArticleHandler:    s.articleHandler,
		CategoryHandler:   s.catagoryHandler,
		UserHandler:       s.userHandler,
		HealthHandler:     s.healthHandler,
		CORSAllowedOrigin: s.cfg.CORSAllowedOrigin,
	})
}

// Config returns the active server configuration
func (s *APIService) Config() *config.Config {
	return s.cfg
}

// StartTime returns the service launch timestamp
func (s *APIService) StartTime() time.Time {
	return s.startTime
}

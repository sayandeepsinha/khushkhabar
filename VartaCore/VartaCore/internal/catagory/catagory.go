package catagory

import (
	"context"
	"net/http"
	"time"

	"vartacore/VartaCore/internal/cache"
	"vartacore/VartaCore/internal/dbactivity"
	"vartacore/common"
)

// Service handles business logic for categories
type Service struct {
	repo  dbactivity.Repository
	cache cache.Cacher
}

func NewService(repo dbactivity.Repository, c cache.Cacher) *Service {
	return &Service{
		repo:  repo,
		cache: c,
	}
}

// GetCategories returns all categories, cached in Redis/Memory
func (s *Service) GetCategories(ctx context.Context) ([]dbactivity.Category, error) {
	var categories []dbactivity.Category
	if s.cache.Get(ctx, cache.KeyCategories, &categories) {
		return categories, nil
	}

	categories, err := s.repo.GetCategories(ctx)
	if err != nil {
		return nil, err
	}

	_ = s.cache.Set(ctx, cache.KeyCategories, categories, 15*time.Minute)
	return categories, nil
}

// Handler handles HTTP requests for categories
type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

// ListCategories handles GET /api/categories
func (h *Handler) ListCategories(w http.ResponseWriter, r *http.Request) {
	categories, err := h.service.GetCategories(r.Context())
	if err != nil {
		common.WriteError(w, http.StatusInternalServerError, "failed to retrieve categories")
		return
	}
	common.WriteJSON(w, http.StatusOK, categories)
}

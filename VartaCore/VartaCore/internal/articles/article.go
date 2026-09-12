package articles

import (
	"context"
	"net/http"
	"strconv"
	"strings"
	"time"

	"vartacore/VartaCore/internal/cache"
	"vartacore/VartaCore/internal/dbactivity"
	"vartacore/common"
)

// Service coordinates article data and caching
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

func (s *Service) GetArticles(ctx context.Context, categorySlug, search string, limit, offset int, userID string) ([]dbactivity.Article, error) {
	cacheKey := cache.KeyArticles(categorySlug, search)
	var articles []dbactivity.Article

	// Use cache only when not personalized with bookmarks
	if userID == "" && search == "" {
		if s.cache.Get(ctx, cacheKey, &articles) {
			return articles, nil
		}
	}

	var err error
	articles, err = s.repo.GetArticles(ctx, categorySlug, search, limit, offset)
	if err != nil {
		return nil, err
	}

	// Attach bookmark state if user is logged in
	if userID != "" {
		bookmarks, _ := s.repo.GetUserBookmarks(ctx, userID)
		bMap := make(map[string]bool)
		for _, b := range bookmarks {
			bMap[b] = true
		}
		for i := range articles {
			articles[i].Bookmarked = bMap[articles[i].ID]
		}
	} else if len(articles) > 0 && search == "" {
		_ = s.cache.Set(ctx, cacheKey, articles, 5*time.Minute)
	}

	return articles, nil
}

func (s *Service) GetFeaturedArticle(ctx context.Context, userID string) (*dbactivity.Article, error) {
	var art *dbactivity.Article

	if userID == "" {
		var cached dbactivity.Article
		if s.cache.Get(ctx, cacheKeyFeaturedArticle(s), &cached) {
			return &cached, nil
		}
	}

	var err error
	art, err = s.repo.GetFeaturedArticle(ctx)
	if err != nil || art == nil {
		return nil, err
	}

	if userID != "" {
		bookmarks, _ := s.repo.GetUserBookmarks(ctx, userID)
		for _, b := range bookmarks {
			if b == art.ID {
				art.Bookmarked = true
				break
			}
		}
	} else {
		_ = s.cache.Set(ctx, cache.KeyFeaturedArticle, *art, 10*time.Minute)
	}

	return art, nil
}

func cacheKeyFeaturedArticle(s *Service) string {
	return cache.KeyFeaturedArticle
}

func (s *Service) GetBestArticles(ctx context.Context, limit int, userID string) ([]dbactivity.Article, error) {
	var articles []dbactivity.Article

	if userID == "" {
		if s.cache.Get(ctx, cache.KeyBestArticles, &articles) {
			return articles, nil
		}
	}

	var err error
	articles, err = s.repo.GetBestArticles(ctx, limit)
	if err != nil {
		return nil, err
	}

	if userID != "" {
		bookmarks, _ := s.repo.GetUserBookmarks(ctx, userID)
		bMap := make(map[string]bool)
		for _, b := range bookmarks {
			bMap[b] = true
		}
		for i := range articles {
			articles[i].Bookmarked = bMap[articles[i].ID]
		}
	} else {
		_ = s.cache.Set(ctx, cache.KeyBestArticles, articles, 10*time.Minute)
	}

	return articles, nil
}

func (s *Service) ToggleBookmark(ctx context.Context, userID, articleID string) (bool, error) {
	bookmarked, err := s.repo.ToggleBookmark(ctx, userID, articleID)
	return bookmarked, err
}

func (s *Service) GetArticleByID(ctx context.Context, id, userID string) (*dbactivity.Article, error) {
	art, err := s.repo.GetArticleByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if userID != "" {
		bookmarks, _ := s.repo.GetUserBookmarks(ctx, userID)
		for _, b := range bookmarks {
			if b == art.ID {
				art.Bookmarked = true
				break
			}
		}
	}
	return art, nil
}

// Handler handles HTTP requests for articles
type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

// Helper to extract authenticated user or fallback to demo user
func getUserID(r *http.Request) string {
	authHeader := r.Header.Get("Authorization")
	if strings.HasPrefix(authHeader, "Bearer ") {
		token := strings.TrimPrefix(authHeader, "Bearer ")
		if token != "" {
			return "usr-varta-01" // Demo / active user
		}
	}
	return "usr-varta-01" // Default user context for seamless UI interaction
}

// ListArticles handles GET /api/articles?category=slug&search=q&limit=30&offset=0
func (h *Handler) ListArticles(w http.ResponseWriter, r *http.Request) {
	category := r.URL.Query().Get("category")
	search := r.URL.Query().Get("search")
	limitStr := r.URL.Query().Get("limit")
	offsetStr := r.URL.Query().Get("offset")

	limit := 30
	if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
		limit = l
	}
	offset := 0
	if o, err := strconv.Atoi(offsetStr); err == nil && o >= 0 {
		offset = o
	}

	userID := getUserID(r)
	articles, err := h.service.GetArticles(r.Context(), category, search, limit, offset, userID)
	if err != nil {
		common.WriteError(w, http.StatusInternalServerError, "failed to retrieve articles")
		return
	}

	if articles == nil {
		articles = []dbactivity.Article{}
	}
	common.WriteJSON(w, http.StatusOK, articles)
}

// FeaturedArticle handles GET /api/articles/featured
func (h *Handler) FeaturedArticle(w http.ResponseWriter, r *http.Request) {
	userID := getUserID(r)
	article, err := h.service.GetFeaturedArticle(r.Context(), userID)
	if err != nil || article == nil {
		common.WriteError(w, http.StatusNotFound, "no featured article found")
		return
	}
	common.WriteJSON(w, http.StatusOK, article)
}

// BestArticles handles GET /api/articles/best
func (h *Handler) BestArticles(w http.ResponseWriter, r *http.Request) {
	limitStr := r.URL.Query().Get("limit")
	limit := 10
	if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
		limit = l
	}

	userID := getUserID(r)
	articles, err := h.service.GetBestArticles(r.Context(), limit, userID)
	if err != nil {
		common.WriteError(w, http.StatusInternalServerError, "failed to retrieve best articles")
		return
	}

	if articles == nil {
		articles = []dbactivity.Article{}
	}
	common.WriteJSON(w, http.StatusOK, articles)
}

// GetArticle handles GET /api/articles/{id}
func (h *Handler) GetArticle(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		common.WriteError(w, http.StatusBadRequest, "missing article id")
		return
	}

	userID := getUserID(r)
	art, err := h.service.GetArticleByID(r.Context(), id, userID)
	if err != nil {
		common.WriteError(w, http.StatusNotFound, "article not found")
		return
	}
	common.WriteJSON(w, http.StatusOK, art)
}

// BookmarkArticle handles POST /api/articles/{id}/bookmark
func (h *Handler) BookmarkArticle(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		common.WriteError(w, http.StatusBadRequest, "missing article id")
		return
	}

	userID := getUserID(r)
	bookmarked, err := h.service.ToggleBookmark(r.Context(), userID, id)
	if err != nil {
		common.WriteError(w, http.StatusInternalServerError, "failed to toggle bookmark")
		return
	}

	common.WriteJSON(w, http.StatusOK, map[string]any{
		"bookmarked": bookmarked,
	})
}

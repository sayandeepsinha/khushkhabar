package server

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"vartacore/VartaCore/internal/articles"
	"vartacore/VartaCore/internal/cache"
	"vartacore/VartaCore/internal/catagory"
	"vartacore/VartaCore/internal/config"
	"vartacore/VartaCore/internal/dbactivity"
	"vartacore/VartaCore/internal/user"
)

func setupTestServer() http.Handler {
	cfg := &config.Config{
		Port:              "8080",
		CORSAllowedOrigin: "*",
		Environment:       "test",
	}

	repo := dbactivity.NewMemoryRepository()
	c := cache.NewMemoryCache()

	catService := catagory.NewService(repo, c)
	artService := articles.NewService(repo, c)
	userService := user.NewService(repo)

	catHandler := catagory.NewHandler(catService)
	artHandler := articles.NewHandler(artService)
	userHandler := user.NewHandler(userService)

	apiService := NewAPIService(cfg, repo, c, artHandler, catHandler, userHandler)
	return apiService.Router()
}

func TestHealthEndpoint(t *testing.T) {
	router := setupTestServer()
	req := httptest.NewRequest("GET", "/api/health", nil)
	rec := httptest.NewRecorder()

	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("Expected status 200, got %d", rec.Code)
	}

	var resp map[string]any
	if err := json.NewDecoder(rec.Body).Decode(&resp); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	if resp["status"] != "healthy" {
		t.Errorf("Expected status 'healthy', got %v", resp["status"])
	}
}

func TestCategoriesEndpoint(t *testing.T) {
	router := setupTestServer()
	req := httptest.NewRequest("GET", "/api/categories", nil)
	rec := httptest.NewRecorder()

	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("Expected status 200, got %d", rec.Code)
	}

	var categories []dbactivity.Category
	if err := json.NewDecoder(rec.Body).Decode(&categories); err != nil {
		t.Fatalf("Failed to decode categories: %v", err)
	}

	if len(categories) == 0 {
		t.Errorf("Expected non-empty categories")
	}
}

func TestArticlesEndpoints(t *testing.T) {
	router := setupTestServer()

	// 1. List articles
	req := httptest.NewRequest("GET", "/api/articles", nil)
	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("GET /api/articles expected 200, got %d", rec.Code)
	}

	var list []dbactivity.Article
	if err := json.NewDecoder(rec.Body).Decode(&list); err != nil {
		t.Fatalf("Failed to decode articles: %v", err)
	}
	if len(list) == 0 {
		t.Fatalf("Expected articles to be returned")
	}

	// 2. Featured article
	reqFeatured := httptest.NewRequest("GET", "/api/articles/featured", nil)
	recFeatured := httptest.NewRecorder()
	router.ServeHTTP(recFeatured, reqFeatured)
	if recFeatured.Code != http.StatusOK {
		t.Fatalf("GET /api/articles/featured expected 200, got %d", recFeatured.Code)
	}

	// 3. Best articles
	reqBest := httptest.NewRequest("GET", "/api/articles/best", nil)
	recBest := httptest.NewRecorder()
	router.ServeHTTP(recBest, reqBest)
	if recBest.Code != http.StatusOK {
		t.Fatalf("GET /api/articles/best expected 200, got %d", recBest.Code)
	}

	// 4. Bookmark toggle
	reqBookmark := httptest.NewRequest("POST", "/api/articles/art-1/bookmark", nil)
	recBookmark := httptest.NewRecorder()
	router.ServeHTTP(recBookmark, reqBookmark)
	if recBookmark.Code != http.StatusOK {
		t.Fatalf("POST /api/articles/art-1/bookmark expected 200, got %d", recBookmark.Code)
	}
}

func TestAuthAndPreferences(t *testing.T) {
	router := setupTestServer()

	// 1. Register / Login
	loginBody := `{"email":"test@varta.news","password":"secretpassword"}`
	reqLogin := httptest.NewRequest("POST", "/api/auth/login", strings.NewReader(loginBody))
	reqLogin.Header.Set("Content-Type", "application/json")
	recLogin := httptest.NewRecorder()
	router.ServeHTTP(recLogin, reqLogin)

	if recLogin.Code != http.StatusOK {
		t.Fatalf("POST /api/auth/login expected 200, got %d", recLogin.Code)
	}

	// 2. Get preferences
	reqPrefs := httptest.NewRequest("GET", "/api/user/preferences", nil)
	recPrefs := httptest.NewRecorder()
	router.ServeHTTP(recPrefs, reqPrefs)

	if recPrefs.Code != http.StatusOK {
		t.Fatalf("GET /api/user/preferences expected 200, got %d", recPrefs.Code)
	}
}

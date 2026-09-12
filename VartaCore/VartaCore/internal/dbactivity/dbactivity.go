package dbactivity

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"strings"
	"sync"
	"time"

	"vartacore/common"
)

// Category model
type Category struct {
	ID           string `json:"id"`
	Name         string `json:"name"`
	Slug         string `json:"slug"`
	IconName     string `json:"iconName"`
	Description  string `json:"description"`
	ArticleCount int    `json:"articleCount"`
}

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

// Repository defines all database operations
type Repository interface {
	InitSchema(ctx context.Context) error
	SeedDefaults(ctx context.Context) error

	GetCategories(ctx context.Context) ([]Category, error)
	GetArticles(ctx context.Context, categorySlug, search string, limit, offset int) ([]Article, error)
	GetFeaturedArticle(ctx context.Context) (*Article, error)
	GetBestArticles(ctx context.Context, limit int) ([]Article, error)
	GetArticleByID(ctx context.Context, id string) (*Article, error)
	SaveArticle(ctx context.Context, a *Article) error
	ArticleExistsByUrlOrTitle(ctx context.Context, url, title string) (bool, error)

	ToggleBookmark(ctx context.Context, userID, articleID string) (bool, error)
	GetUserBookmarks(ctx context.Context, userID string) ([]string, error)

	CreateUser(ctx context.Context, u *User) error
	GetUserByEmail(ctx context.Context, email string) (*User, error)
	GetUserByID(ctx context.Context, id string) (*User, error)
	GetUserPreferences(ctx context.Context, userID string) (*UserPreferences, error)
	UpdateUserPreferences(ctx context.Context, userID string, prefs *UserPreferences) error
	DeleteUser(ctx context.Context, userID string) error
}

// DefaultCategories used for seeding both MySQL and in-memory store
var DefaultCategories = []Category{
	{ID: "cat-all", Name: "All Stories", Slug: "all", IconName: "Sparkles", Description: "Every uplifting story from around the world", ArticleCount: 0},
	{ID: "cat-planet", Name: "Planet & Climate", Slug: "planet", IconName: "Leaf", Description: "Reforestation, wildlife comebacks, and clean energy milestones", ArticleCount: 0},
	{ID: "cat-science", Name: "Science & Discovery", Slug: "science", IconName: "FlaskConical", Description: "Medical triumphs, space exploration, and human ingenuity", ArticleCount: 0},
	{ID: "cat-kindness", Name: "Humanity & Kindness", Slug: "kindness", IconName: "HeartHandshake", Description: "Selfless neighbors, heroic rescues, and uplifting communities", ArticleCount: 0},
	{ID: "cat-health", Name: "Health & Wellness", Slug: "health", IconName: "Activity", Description: "Breakthrough treatments, mental health progress, and longevity", ArticleCount: 0},
	{ID: "cat-innovation", Name: "Positive Tech", Slug: "innovation", IconName: "Cpu", Description: "Technology built for human flourishing and planetary balance", ArticleCount: 0},
	{ID: "cat-community", Name: "Culture & Arts", Slug: "culture", IconName: "Palette", Description: "Inspiring arts, restored heritage, and joyful traditions", ArticleCount: 0},
}

// DefaultArticles for initial seeding
var DefaultArticles = []Article{
	{
		ID:                 "art-1",
		Title:              "Historic Milestone: Global Renewable Power Surpasses Coal for the First Time",
		Summary:            "A breathtaking acceleration in solar and wind installations across 40 countries has permanently tipped the balance toward clean energy.",
		Content:            "In what environmental scientists are calling the turning point of the century, clean energy generation officially overtook fossil fuel power across major grids worldwide this past quarter.",
		Category:           "Planet & Climate",
		CategorySlug:       "planet",
		ImageURL:           "https://images.unsplash.com/photo-1523848309072-c199db53f137?auto=format&fit=crop&w=1000&q=80",
		SourceName:         "Global Clean Energy Review",
		SourceURL:          "https://example.com/energy-turning-point",
		Author:             "Elena Rostova",
		PublishedAt:        "2 hours ago",
		ReadingTimeMinutes: 4,
		PositivityScore:    99,
		UpliftBadge:        "99% Joy Index",
		IsFeatured:         true,
		IsBestOfWeek:       true,
		Status:             "published",
		CreatedAt:          time.Now().Add(-2 * time.Hour),
	},
	{
		ID:                 "art-2",
		Title:              "Humpback Whales Make Miraculous Population Recovery, Nearing Historic Pre-Whaling Numbers",
		Summary:            "Decades of international ocean protection treaties and acoustic tracking have culminated in one of the greatest marine conservation victories in modern memory.",
		Content:            "Decades of patient, coordinated international treaties have borne magnificent fruit: global humpback whale populations have rebounded from near-extinction levels to more than 93% of their pre-whaling baselines.",
		Category:           "Planet & Climate",
		CategorySlug:       "planet",
		ImageURL:           "https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=1000&q=80",
		SourceName:         "Marine Conservation Chronicle",
		SourceURL:          "https://example.com/whales-recovery",
		Author:             "David Attenborough Society",
		PublishedAt:        "4 hours ago",
		ReadingTimeMinutes: 3,
		PositivityScore:    97,
		UpliftBadge:        "Conservation Triumph",
		IsFeatured:         false,
		IsBestOfWeek:       true,
		Status:             "published",
		CreatedAt:          time.Now().Add(-4 * time.Hour),
	},
	{
		ID:                 "art-3",
		Title:              "Revolutionary Non-Invasive Ultrasound Therapy Eradicates Glioblastoma Cells in Clinical Trial",
		Summary:            "Pioneered by neuroscientists in Kyoto and Boston, targeted focused sound waves opened the blood-brain barrier with zero surgical trauma, delivering a 92% remission rate.",
		Content:            "A multi-center medical trial combining low-intensity pulsed ultrasound with microscopic microbubbles has yielded a landmark breakthrough against previously untreatable glioblastoma tumors.",
		Category:           "Science & Discovery",
		CategorySlug:       "science",
		ImageURL:           "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80",
		SourceName:         "Annals of Breakthrough Medicine",
		SourceURL:          "https://example.com/ultrasound-glioblastoma",
		Author:             "Dr. Aris Thorne",
		PublishedAt:        "6 hours ago",
		ReadingTimeMinutes: 5,
		PositivityScore:    98,
		UpliftBadge:        "Medical Miracle",
		IsFeatured:         false,
		IsBestOfWeek:       true,
		Status:             "published",
		CreatedAt:          time.Now().Add(-6 * time.Hour),
	},
}

// NewRepository creates either a MySQL repository or resilient in-memory repository
func NewRepository(db *sql.DB) Repository {
	if db != nil {
		return &MySQLRepository{db: db}
	}
	return NewMemoryRepository()
}

// -------------------------------------------------------------
// IN-MEMORY REPOSITORY (Resilient Fallback Mode)
// -------------------------------------------------------------

type MemoryRepository struct {
	mu          sync.RWMutex
	categories  map[string]Category
	articles    map[string]Article
	users       map[string]User
	preferences map[string]UserPreferences
	bookmarks   map[string]map[string]bool // userID -> articleID -> true
}

func NewMemoryRepository() *MemoryRepository {
	repo := &MemoryRepository{
		categories:  make(map[string]Category),
		articles:    make(map[string]Article),
		users:       make(map[string]User),
		preferences: make(map[string]UserPreferences),
		bookmarks:   make(map[string]map[string]bool),
	}
	_ = repo.SeedDefaults(context.Background())
	return repo
}

func (m *MemoryRepository) InitSchema(ctx context.Context) error {
	return nil
}

func (m *MemoryRepository) SeedDefaults(ctx context.Context) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	for _, cat := range DefaultCategories {
		m.categories[cat.ID] = cat
	}
	for _, art := range DefaultArticles {
		m.articles[art.ID] = art
	}

	demoUser := User{
		ID:        "usr-varta-01",
		Name:      "Prince Sharma",
		Email:     "prince@varta.news",
		CreatedAt: time.Now(),
	}
	m.users[demoUser.ID] = demoUser
	m.preferences[demoUser.ID] = UserPreferences{
		FavoriteCategories:     []string{"planet", "science", "kindness", "innovation", "health", "culture"},
		PositivityThreshold:    85,
		DailyDigestEmail:       true,
		BreakingGoodNewsAlerts: false,
		ReadingLayout:          "comfortable",
		QuoteOfTheDay:          true,
	}

	if m.bookmarks[demoUser.ID] == nil {
		m.bookmarks[demoUser.ID] = make(map[string]bool)
	}
	m.bookmarks[demoUser.ID]["art-1"] = true
	m.bookmarks[demoUser.ID]["art-3"] = true

	m.updateCategoryCountsLocked()
	return nil
}

func (m *MemoryRepository) updateCategoryCountsLocked() {
	counts := make(map[string]int)
	total := 0
	for _, a := range m.articles {
		counts[a.CategorySlug]++
		total++
	}
	for id, cat := range m.categories {
		if cat.Slug == "all" {
			cat.ArticleCount = total
		} else {
			cat.ArticleCount = counts[cat.Slug]
		}
		m.categories[id] = cat
	}
}

func (m *MemoryRepository) GetCategories(ctx context.Context) ([]Category, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	var result []Category
	for _, defaultCat := range DefaultCategories {
		if cat, exists := m.categories[defaultCat.ID]; exists {
			result = append(result, cat)
		}
	}
	return result, nil
}

func (m *MemoryRepository) GetArticles(ctx context.Context, categorySlug, search string, limit, offset int) ([]Article, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	var matched []Article
	q := strings.ToLower(strings.TrimSpace(search))

	for _, a := range m.articles {
		if categorySlug != "" && categorySlug != "all" && a.CategorySlug != categorySlug {
			continue
		}
		if q != "" {
			tMatch := strings.Contains(strings.ToLower(a.Title), q)
			sMatch := strings.Contains(strings.ToLower(a.Summary), q)
			cMatch := strings.Contains(strings.ToLower(a.Category), q)
			if !tMatch && !sMatch && !cMatch {
				continue
			}
		}
		matched = append(matched, a)
	}

	if offset >= len(matched) {
		return []Article{}, nil
	}
	end := offset + limit
	if limit <= 0 || end > len(matched) {
		end = len(matched)
	}
	return matched[offset:end], nil
}

func (m *MemoryRepository) GetFeaturedArticle(ctx context.Context) (*Article, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	for _, a := range m.articles {
		if a.IsFeatured {
			copyArt := a
			return &copyArt, nil
		}
	}
	for _, a := range m.articles {
		copyArt := a
		return &copyArt, nil
	}
	return nil, nil
}

func (m *MemoryRepository) GetBestArticles(ctx context.Context, limit int) ([]Article, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	var list []Article
	for _, a := range m.articles {
		if a.IsBestOfWeek {
			list = append(list, a)
		}
	}
	if limit > 0 && len(list) > limit {
		return list[:limit], nil
	}
	return list, nil
}

func (m *MemoryRepository) GetArticleByID(ctx context.Context, id string) (*Article, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	if a, ok := m.articles[id]; ok {
		copyArt := a
		return &copyArt, nil
	}
	return nil, sql.ErrNoRows
}

func (m *MemoryRepository) SaveArticle(ctx context.Context, a *Article) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if a.ID == "" {
		a.ID = common.GenerateID("art-")
	}
	if a.CreatedAt.IsZero() {
		a.CreatedAt = time.Now()
	}
	m.articles[a.ID] = *a
	m.updateCategoryCountsLocked()
	return nil
}

func (m *MemoryRepository) ArticleExistsByUrlOrTitle(ctx context.Context, url, title string) (bool, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	cleanUrl := strings.TrimSpace(strings.ToLower(url))
	cleanTitle := strings.TrimSpace(strings.ToLower(title))

	for _, a := range m.articles {
		if cleanUrl != "" && strings.TrimSpace(strings.ToLower(a.SourceURL)) == cleanUrl {
			return true, nil
		}
		if cleanTitle != "" && strings.TrimSpace(strings.ToLower(a.Title)) == cleanTitle {
			return true, nil
		}
	}
	return false, nil
}

func (m *MemoryRepository) ToggleBookmark(ctx context.Context, userID, articleID string) (bool, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	if m.bookmarks[userID] == nil {
		m.bookmarks[userID] = make(map[string]bool)
	}

	exists := m.bookmarks[userID][articleID]
	if exists {
		delete(m.bookmarks[userID], articleID)
		return false, nil
	}
	m.bookmarks[userID][articleID] = true
	return true, nil
}

func (m *MemoryRepository) GetUserBookmarks(ctx context.Context, userID string) ([]string, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	var result []string
	if userMarks, ok := m.bookmarks[userID]; ok {
		for id := range userMarks {
			result = append(result, id)
		}
	}
	return result, nil
}

func (m *MemoryRepository) CreateUser(ctx context.Context, u *User) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if u.ID == "" {
		u.ID = common.GenerateID("usr-")
	}
	if u.CreatedAt.IsZero() {
		u.CreatedAt = time.Now()
	}
	m.users[u.ID] = *u
	m.preferences[u.ID] = UserPreferences{
		FavoriteCategories:  []string{"planet", "science", "kindness"},
		PositivityThreshold: 80,
		ReadingLayout:       "comfortable",
	}
	return nil
}

func (m *MemoryRepository) GetUserByEmail(ctx context.Context, email string) (*User, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	cleanEmail := strings.ToLower(strings.TrimSpace(email))
	for _, u := range m.users {
		if strings.ToLower(u.Email) == cleanEmail {
			copyU := u
			return &copyU, nil
		}
	}
	return nil, sql.ErrNoRows
}

func (m *MemoryRepository) GetUserByID(ctx context.Context, id string) (*User, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	if u, ok := m.users[id]; ok {
		copyU := u
		return &copyU, nil
	}
	return nil, sql.ErrNoRows
}

func (m *MemoryRepository) GetUserPreferences(ctx context.Context, userID string) (*UserPreferences, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	if p, ok := m.preferences[userID]; ok {
		copyP := p
		return &copyP, nil
	}
	return &UserPreferences{
		FavoriteCategories:  []string{"planet", "science"},
		PositivityThreshold: 80,
		ReadingLayout:       "comfortable",
	}, nil
}

func (m *MemoryRepository) UpdateUserPreferences(ctx context.Context, userID string, prefs *UserPreferences) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.preferences[userID] = *prefs
	return nil
}

func (m *MemoryRepository) DeleteUser(ctx context.Context, userID string) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	delete(m.users, userID)
	delete(m.preferences, userID)
	delete(m.bookmarks, userID)
	return nil
}

// -------------------------------------------------------------
// MYSQL REPOSITORY IMPLEMENTATION
// -------------------------------------------------------------

type MySQLRepository struct {
	db *sql.DB
}

func (r *MySQLRepository) InitSchema(ctx context.Context) error {
	queries := []string{
		`CREATE TABLE IF NOT EXISTS categories (
			id VARCHAR(64) PRIMARY KEY,
			name VARCHAR(128) NOT NULL,
			slug VARCHAR(64) NOT NULL UNIQUE,
			icon_name VARCHAR(64) NOT NULL,
			description TEXT,
			article_count INT DEFAULT 0
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

		`CREATE TABLE IF NOT EXISTS articles (
			id VARCHAR(64) PRIMARY KEY,
			title VARCHAR(512) NOT NULL,
			summary TEXT NOT NULL,
			content LONGTEXT,
			category VARCHAR(128) NOT NULL,
			category_slug VARCHAR(64) NOT NULL,
			image_url TEXT,
			source_name VARCHAR(128) NOT NULL,
			source_url VARCHAR(512),
			author VARCHAR(128),
			published_at VARCHAR(128),
			reading_time_minutes INT DEFAULT 3,
			positivity_score INT DEFAULT 85,
			uplift_badge VARCHAR(128),
			is_featured BOOLEAN DEFAULT FALSE,
			is_best_of_week BOOLEAN DEFAULT FALSE,
			status VARCHAR(32) DEFAULT 'published',
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			INDEX idx_articles_slug (category_slug),
			INDEX idx_articles_featured (is_featured),
			INDEX idx_articles_best (is_best_of_week),
			INDEX idx_articles_created (created_at)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

		`CREATE TABLE IF NOT EXISTS users (
			id VARCHAR(64) PRIMARY KEY,
			name VARCHAR(128) NOT NULL,
			email VARCHAR(191) NOT NULL UNIQUE,
			password_hash VARCHAR(256) NOT NULL,
			avatar_url TEXT,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

		`CREATE TABLE IF NOT EXISTS user_preferences (
			user_id VARCHAR(64) PRIMARY KEY,
			favorite_categories TEXT,
			positivity_threshold INT DEFAULT 80,
			daily_digest_email BOOLEAN DEFAULT TRUE,
			breaking_good_news_alerts BOOLEAN DEFAULT FALSE,
			reading_layout VARCHAR(32) DEFAULT 'comfortable',
			quote_of_the_day BOOLEAN DEFAULT TRUE,
			FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

		`CREATE TABLE IF NOT EXISTS bookmarks (
			user_id VARCHAR(64) NOT NULL,
			article_id VARCHAR(64) NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY (user_id, article_id),
			FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
			FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
	}

	for _, q := range queries {
		if _, err := r.db.ExecContext(ctx, q); err != nil {
			return fmt.Errorf("failed executing ddl: %w", err)
		}
	}
	return nil
}

func (r *MySQLRepository) SeedDefaults(ctx context.Context) error {
	for _, c := range DefaultCategories {
		query := `INSERT INTO categories (id, name, slug, icon_name, description, article_count)
			VALUES (?, ?, ?, ?, ?, ?)
			ON DUPLICATE KEY UPDATE name=VALUES(name), icon_name=VALUES(icon_name), description=VALUES(description)`
		if _, err := r.db.ExecContext(ctx, query, c.ID, c.Name, c.Slug, c.IconName, c.Description, c.ArticleCount); err != nil {
			return err
		}
	}

	var count int
	err := r.db.QueryRowContext(ctx, "SELECT COUNT(*) FROM articles").Scan(&count)
	if err == nil && count == 0 {
		for _, a := range DefaultArticles {
			_ = r.SaveArticle(ctx, &a)
		}
	}

	var userCount int
	_ = r.db.QueryRowContext(ctx, "SELECT COUNT(*) FROM users").Scan(&userCount)
	if userCount == 0 {
		demo := User{
			ID:        "usr-varta-01",
			Name:      "Prince Sharma",
			Email:     "prince@varta.news",
			CreatedAt: time.Now(),
		}
		_ = r.CreateUser(ctx, &demo)
	}

	return nil
}

func (r *MySQLRepository) GetCategories(ctx context.Context) ([]Category, error) {
	rows, err := r.db.QueryContext(ctx, "SELECT id, name, slug, icon_name, description, article_count FROM categories ORDER BY id ASC")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []Category
	for rows.Next() {
		var c Category
		if err := rows.Scan(&c.ID, &c.Name, &c.Slug, &c.IconName, &c.Description, &c.ArticleCount); err != nil {
			return nil, err
		}
		result = append(result, c)
	}
	return result, nil
}

func (r *MySQLRepository) GetArticles(ctx context.Context, categorySlug, search string, limit, offset int) ([]Article, error) {
	whereClauses := []string{"1=1"}
	args := []any{}

	if categorySlug != "" && categorySlug != "all" {
		whereClauses = append(whereClauses, "category_slug = ?")
		args = append(args, categorySlug)
	}
	if search != "" {
		whereClauses = append(whereClauses, "(LOWER(title) LIKE ? OR LOWER(summary) LIKE ? OR LOWER(category) LIKE ?)")
		searchTerm := "%" + strings.ToLower(search) + "%"
		args = append(args, searchTerm, searchTerm, searchTerm)
	}

	if limit <= 0 {
		limit = 30
	}
	query := fmt.Sprintf(`SELECT id, title, summary, content, category, category_slug, image_url, source_name, source_url, author, published_at, reading_time_minutes, positivity_score, uplift_badge, is_featured, is_best_of_week, created_at 
		FROM articles 
		WHERE %s 
		ORDER BY created_at DESC 
		LIMIT ? OFFSET ?`, strings.Join(whereClauses, " AND "))
	args = append(args, limit, offset)

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var articles []Article
	for rows.Next() {
		var a Article
		if err := rows.Scan(&a.ID, &a.Title, &a.Summary, &a.Content, &a.Category, &a.CategorySlug, &a.ImageURL, &a.SourceName, &a.SourceURL, &a.Author, &a.PublishedAt, &a.ReadingTimeMinutes, &a.PositivityScore, &a.UpliftBadge, &a.IsFeatured, &a.IsBestOfWeek, &a.CreatedAt); err != nil {
			return nil, err
		}
		articles = append(articles, a)
	}
	return articles, nil
}

func (r *MySQLRepository) GetFeaturedArticle(ctx context.Context) (*Article, error) {
	var a Article
	query := `SELECT id, title, summary, content, category, category_slug, image_url, source_name, source_url, author, published_at, reading_time_minutes, positivity_score, uplift_badge, is_featured, is_best_of_week, created_at 
		FROM articles 
		WHERE is_featured = TRUE 
		ORDER BY created_at DESC 
		LIMIT 1`
	err := r.db.QueryRowContext(ctx, query).Scan(&a.ID, &a.Title, &a.Summary, &a.Content, &a.Category, &a.CategorySlug, &a.ImageURL, &a.SourceName, &a.SourceURL, &a.Author, &a.PublishedAt, &a.ReadingTimeMinutes, &a.PositivityScore, &a.UpliftBadge, &a.IsFeatured, &a.IsBestOfWeek, &a.CreatedAt)
	if err == sql.ErrNoRows {
		fallbackQuery := `SELECT id, title, summary, content, category, category_slug, image_url, source_name, source_url, author, published_at, reading_time_minutes, positivity_score, uplift_badge, is_featured, is_best_of_week, created_at 
			FROM articles ORDER BY created_at DESC LIMIT 1`
		err = r.db.QueryRowContext(ctx, fallbackQuery).Scan(&a.ID, &a.Title, &a.Summary, &a.Content, &a.Category, &a.CategorySlug, &a.ImageURL, &a.SourceName, &a.SourceURL, &a.Author, &a.PublishedAt, &a.ReadingTimeMinutes, &a.PositivityScore, &a.UpliftBadge, &a.IsFeatured, &a.IsBestOfWeek, &a.CreatedAt)
	}
	if err != nil {
		return nil, err
	}
	return &a, nil
}

func (r *MySQLRepository) GetBestArticles(ctx context.Context, limit int) ([]Article, error) {
	if limit <= 0 {
		limit = 10
	}
	query := `SELECT id, title, summary, content, category, category_slug, image_url, source_name, source_url, author, published_at, reading_time_minutes, positivity_score, uplift_badge, is_featured, is_best_of_week, created_at 
		FROM articles 
		WHERE is_best_of_week = TRUE 
		ORDER BY positivity_score DESC, created_at DESC 
		LIMIT ?`
	rows, err := r.db.QueryContext(ctx, query, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var articles []Article
	for rows.Next() {
		var a Article
		if err := rows.Scan(&a.ID, &a.Title, &a.Summary, &a.Content, &a.Category, &a.CategorySlug, &a.ImageURL, &a.SourceName, &a.SourceURL, &a.Author, &a.PublishedAt, &a.ReadingTimeMinutes, &a.PositivityScore, &a.UpliftBadge, &a.IsFeatured, &a.IsBestOfWeek, &a.CreatedAt); err != nil {
			return nil, err
		}
		articles = append(articles, a)
	}
	return articles, nil
}

func (r *MySQLRepository) GetArticleByID(ctx context.Context, id string) (*Article, error) {
	var a Article
	query := `SELECT id, title, summary, content, category, category_slug, image_url, source_name, source_url, author, published_at, reading_time_minutes, positivity_score, uplift_badge, is_featured, is_best_of_week, created_at 
		FROM articles 
		WHERE id = ?`
	err := r.db.QueryRowContext(ctx, query, id).Scan(&a.ID, &a.Title, &a.Summary, &a.Content, &a.Category, &a.CategorySlug, &a.ImageURL, &a.SourceName, &a.SourceURL, &a.Author, &a.PublishedAt, &a.ReadingTimeMinutes, &a.PositivityScore, &a.UpliftBadge, &a.IsFeatured, &a.IsBestOfWeek, &a.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &a, nil
}

func (r *MySQLRepository) SaveArticle(ctx context.Context, a *Article) error {
	if a.ID == "" {
		a.ID = common.GenerateID("art-")
	}
	if a.CreatedAt.IsZero() {
		a.CreatedAt = time.Now()
	}
	query := `INSERT INTO articles 
		(id, title, summary, content, category, category_slug, image_url, source_name, source_url, author, published_at, reading_time_minutes, positivity_score, uplift_badge, is_featured, is_best_of_week, status, created_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		ON DUPLICATE KEY UPDATE 
			title=VALUES(title), summary=VALUES(summary), content=VALUES(content), image_url=VALUES(image_url), positivity_score=VALUES(positivity_score)`
	_, err := r.db.ExecContext(ctx, query, a.ID, a.Title, a.Summary, a.Content, a.Category, a.CategorySlug, a.ImageURL, a.SourceName, a.SourceURL, a.Author, a.PublishedAt, a.ReadingTimeMinutes, a.PositivityScore, a.UpliftBadge, a.IsFeatured, a.IsBestOfWeek, a.Status, a.CreatedAt)
	return err
}

func (r *MySQLRepository) ArticleExistsByUrlOrTitle(ctx context.Context, url, title string) (bool, error) {
	var count int
	query := "SELECT COUNT(*) FROM articles WHERE source_url = ? OR title = ?"
	err := r.db.QueryRowContext(ctx, query, url, title).Scan(&count)
	return count > 0, err
}

func (r *MySQLRepository) ToggleBookmark(ctx context.Context, userID, articleID string) (bool, error) {
	var count int
	err := r.db.QueryRowContext(ctx, "SELECT COUNT(*) FROM bookmarks WHERE user_id = ? AND article_id = ?", userID, articleID).Scan(&count)
	if err != nil {
		return false, err
	}
	if count > 0 {
		_, err := r.db.ExecContext(ctx, "DELETE FROM bookmarks WHERE user_id = ? AND article_id = ?", userID, articleID)
		return false, err
	}
	_, err = r.db.ExecContext(ctx, "INSERT INTO bookmarks (user_id, article_id) VALUES (?, ?)", userID, articleID)
	return true, err
}

func (r *MySQLRepository) GetUserBookmarks(ctx context.Context, userID string) ([]string, error) {
	rows, err := r.db.QueryContext(ctx, "SELECT article_id FROM bookmarks WHERE user_id = ?", userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var ids []string
	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			return nil, err
		}
		ids = append(ids, id)
	}
	return ids, nil
}

func (r *MySQLRepository) CreateUser(ctx context.Context, u *User) error {
	if u.ID == "" {
		u.ID = common.GenerateID("usr-")
	}
	if u.CreatedAt.IsZero() {
		u.CreatedAt = time.Now()
	}
	query := `INSERT INTO users (id, name, email, password_hash, avatar_url, created_at) VALUES (?, ?, ?, ?, ?, ?)`
	_, err := r.db.ExecContext(ctx, query, u.ID, u.Name, u.Email, u.PasswordHash, u.AvatarURL, u.CreatedAt)
	if err != nil {
		return err
	}

	prefQuery := `INSERT INTO user_preferences (user_id, favorite_categories, positivity_threshold, daily_digest_email, breaking_good_news_alerts, reading_layout, quote_of_the_day)
		VALUES (?, ?, ?, ?, ?, ?, ?)`
	categoriesJSON, _ := json.Marshal([]string{"planet", "science", "kindness"})
	_, _ = r.db.ExecContext(ctx, prefQuery, u.ID, string(categoriesJSON), 80, true, false, "comfortable", true)
	return nil
}

func (r *MySQLRepository) GetUserByEmail(ctx context.Context, email string) (*User, error) {
	var u User
	query := `SELECT id, name, email, password_hash, avatar_url, created_at FROM users WHERE email = ?`
	err := r.db.QueryRowContext(ctx, query, email).Scan(&u.ID, &u.Name, &u.Email, &u.PasswordHash, &u.AvatarURL, &u.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &u, nil
}

func (r *MySQLRepository) GetUserByID(ctx context.Context, id string) (*User, error) {
	var u User
	query := `SELECT id, name, email, password_hash, avatar_url, created_at FROM users WHERE id = ?`
	err := r.db.QueryRowContext(ctx, query, id).Scan(&u.ID, &u.Name, &u.Email, &u.PasswordHash, &u.AvatarURL, &u.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &u, nil
}

func (r *MySQLRepository) GetUserPreferences(ctx context.Context, userID string) (*UserPreferences, error) {
	var (
		favJSON string
		p       UserPreferences
	)
	query := `SELECT favorite_categories, positivity_threshold, daily_digest_email, breaking_good_news_alerts, reading_layout, quote_of_the_day 
		FROM user_preferences WHERE user_id = ?`
	err := r.db.QueryRowContext(ctx, query, userID).Scan(&favJSON, &p.PositivityThreshold, &p.DailyDigestEmail, &p.BreakingGoodNewsAlerts, &p.ReadingLayout, &p.QuoteOfTheDay)
	if err != nil {
		return &UserPreferences{
			FavoriteCategories:  []string{"planet", "science"},
			PositivityThreshold: 80,
			ReadingLayout:       "comfortable",
		}, nil
	}
	_ = json.Unmarshal([]byte(favJSON), &p.FavoriteCategories)
	return &p, nil
}

func (r *MySQLRepository) UpdateUserPreferences(ctx context.Context, userID string, prefs *UserPreferences) error {
	favJSON, _ := json.Marshal(prefs.FavoriteCategories)
	query := `INSERT INTO user_preferences 
		(user_id, favorite_categories, positivity_threshold, daily_digest_email, breaking_good_news_alerts, reading_layout, quote_of_the_day)
		VALUES (?, ?, ?, ?, ?, ?, ?)
		ON DUPLICATE KEY UPDATE
			favorite_categories=VALUES(favorite_categories),
			positivity_threshold=VALUES(positivity_threshold),
			daily_digest_email=VALUES(daily_digest_email),
			breaking_good_news_alerts=VALUES(breaking_good_news_alerts),
			reading_layout=VALUES(reading_layout),
			quote_of_the_day=VALUES(quote_of_the_day)`
	_, err := r.db.ExecContext(ctx, query, userID, string(favJSON), prefs.PositivityThreshold, prefs.DailyDigestEmail, prefs.BreakingGoodNewsAlerts, prefs.ReadingLayout, prefs.QuoteOfTheDay)
	return err
}

func (r *MySQLRepository) DeleteUser(ctx context.Context, userID string) error {
	_, err := r.db.ExecContext(ctx, "DELETE FROM users WHERE id = ?", userID)
	return err
}

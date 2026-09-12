package config

import (
	"os"
	"strconv"
	"strings"
	"time"
)

// Config encapsulates all runtime configuration for VartaCore
type Config struct {
	Port              string
	MySQLDSN          string
	RedisAddr         string
	RedisPassword     string
	RedisDB           int
	NewsFetchInterval time.Duration
	RSSFeeds          []string
	NewsAPIKey        string
	NewsAPIEndpoint   string
	GeminiAPIKey      string
	CORSAllowedOrigin string
	Environment       string
}

// Load reads settings from the environment or assigns sane defaults
func Load() *Config {
	port := getEnv("PORT", "8080")
	mysqlDSN := getEnv("MYSQL_DSN", "root:vartapass@tcp(localhost:3306)/varta?parseTime=true&charset=utf8mb4")
	redisAddr := getEnv("REDIS_ADDR", "localhost:6379")
	redisPass := getEnv("REDIS_PASSWORD", "")
	redisDBStr := getEnv("REDIS_DB", "0")
	redisDB, _ := strconv.Atoi(redisDBStr)

	fetchIntervalMinutesStr := getEnv("NEWS_FETCH_INTERVAL_MINUTES", "15")
	fetchIntervalMinutes, err := strconv.Atoi(fetchIntervalMinutesStr)
	if err != nil || fetchIntervalMinutes <= 0 {
		fetchIntervalMinutes = 15
	}

	// Curated positive news RSS feeds - free, no auth, reliable
	defaultFeeds := []string{
		"https://www.goodnewsnetwork.org/feed/",
		"https://www.positive.news/feed/",
		"https://www.optimistdaily.com/feed/",
		"http://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
	}

	customFeeds := os.Getenv("RSS_FEEDS")
	var feeds []string
	if customFeeds != "" {
		for _, f := range strings.Split(customFeeds, ",") {
			trimmed := strings.TrimSpace(f)
			if trimmed != "" {
				feeds = append(feeds, trimmed)
			}
		}
	}
	if len(feeds) == 0 {
		feeds = defaultFeeds
	}

	return &Config{
		Port:              port,
		MySQLDSN:          mysqlDSN,
		RedisAddr:         redisAddr,
		RedisPassword:     redisPass,
		RedisDB:           redisDB,
		NewsFetchInterval: time.Duration(fetchIntervalMinutes) * time.Minute,
		RSSFeeds:          feeds,
		NewsAPIKey:        getEnv("NEWS_API_KEY", ""),
		NewsAPIEndpoint:   getEnv("NEWS_API_ENDPOINT", "https://newsdata.io/api/1/news"),
		GeminiAPIKey:      getEnv("GEMINI_API_KEY", ""),
		CORSAllowedOrigin: getEnv("CORS_ALLOWED_ORIGIN", "*"),
		Environment:       getEnv("ENV", "development"),
	}
}

func getEnv(key, fallback string) string {
	if val, ok := os.LookupEnv(key); ok && val != "" {
		return val
	}
	return fallback
}

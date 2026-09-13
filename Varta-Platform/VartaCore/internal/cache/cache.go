package cache

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"sync"
	"time"

	"vartacore/shared/logger"

	"github.com/redis/go-redis/v9"
)

const (
	KeyFeaturedArticle = "homepage:featured"
	KeyBestArticles    = "homepage:best"
	KeyCategories      = "categories:all"
)

// KeyArticles generates a cache key for articles listing
func KeyArticles(categorySlug, search string) string {
	return fmt.Sprintf("articles:%s:%s", categorySlug, search)
}

// Cacher defines standard cache operations
type Cacher interface {
	Get(ctx context.Context, key string, dest any) bool
	Set(ctx context.Context, key string, value any, expiration time.Duration) error
	Delete(ctx context.Context, keys ...string) error
	FlushPattern(ctx context.Context, pattern string) error
	IsAvailable() bool
}

// NewCache attempts connecting to Redis; falls back to in-memory cache seamlessly
func NewCache(addr, password string, db int) Cacher {
	var candidates []string
	if addr != "" {
		candidates = append(candidates, addr)
	}
	if addr != "127.0.0.1:6379" && addr != "localhost:6379" {
		candidates = append(candidates, "127.0.0.1:6379")
	}

	for _, targetAddr := range candidates {
		client := redis.NewClient(&redis.Options{
			Addr:        targetAddr,
			Password:    password,
			DB:          db,
			DialTimeout: 1500 * time.Millisecond,
		})

		ctx, cancel := context.WithTimeout(context.Background(), 1500*time.Millisecond)
		err := client.Ping(ctx).Err()
		cancel()

		if err == nil {
			logger.Info("Connected to Redis cache at %s", targetAddr)
			return &RedisCache{client: client}
		}
		_ = client.Close()
	}

	logger.Info("Redis unavailable; operating in resilient in-memory cache mode")
	return NewMemoryCache()
}

// -------------------------------------------------------------
// REDIS IMPLEMENTATION
// -------------------------------------------------------------

type RedisCache struct {
	client *redis.Client
}

func (r *RedisCache) Get(ctx context.Context, key string, dest any) bool {
	val, err := r.client.Get(ctx, key).Result()
	if err != nil {
		return false
	}
	return json.Unmarshal([]byte(val), dest) == nil
}

func (r *RedisCache) Set(ctx context.Context, key string, value any, expiration time.Duration) error {
	data, err := json.Marshal(value)
	if err != nil {
		return err
	}
	return r.client.Set(ctx, key, data, expiration).Err()
}

func (r *RedisCache) Delete(ctx context.Context, keys ...string) error {
	if len(keys) == 0 {
		return nil
	}
	return r.client.Del(ctx, keys...).Err()
}

func (r *RedisCache) FlushPattern(ctx context.Context, pattern string) error {
	iter := r.client.Scan(ctx, 0, pattern, 0).Iterator()
	var keys []string
	for iter.Next(ctx) {
		keys = append(keys, iter.Val())
	}
	if err := iter.Err(); err != nil {
		return err
	}
	if len(keys) > 0 {
		return r.client.Del(ctx, keys...).Err()
	}
	return nil
}

func (r *RedisCache) IsAvailable() bool {
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()
	return r.client.Ping(ctx).Err() == nil
}

// -------------------------------------------------------------
// IN-MEMORY CACHE (Resilient Fallback Mode)
// -------------------------------------------------------------

type memItem struct {
	data      []byte
	expiresAt time.Time
}

type MemoryCache struct {
	mu    sync.RWMutex
	items map[string]memItem
}

func NewMemoryCache() *MemoryCache {
	m := &MemoryCache{
		items: make(map[string]memItem),
	}
	// Background cleanup of expired items every minute
	go func() {
		ticker := time.NewTicker(1 * time.Minute)
		defer ticker.Stop()
		for range ticker.C {
			m.cleanup()
		}
	}()
	return m
}

func (m *MemoryCache) cleanup() {
	m.mu.Lock()
	defer m.mu.Unlock()
	now := time.Now()
	for k, item := range m.items {
		if !item.expiresAt.IsZero() && now.After(item.expiresAt) {
			delete(m.items, k)
		}
	}
}

func (m *MemoryCache) Get(ctx context.Context, key string, dest any) bool {
	m.mu.RLock()
	defer m.mu.RUnlock()

	item, exists := m.items[key]
	if !exists {
		return false
	}
	if !item.expiresAt.IsZero() && time.Now().After(item.expiresAt) {
		return false
	}
	return json.Unmarshal(item.data, dest) == nil
}

func (m *MemoryCache) Set(ctx context.Context, key string, value any, expiration time.Duration) error {
	data, err := json.Marshal(value)
	if err != nil {
		return err
	}

	var expiresAt time.Time
	if expiration > 0 {
		expiresAt = time.Now().Add(expiration)
	}

	m.mu.Lock()
	defer m.mu.Unlock()
	m.items[key] = memItem{
		data:      data,
		expiresAt: expiresAt,
	}
	return nil
}

func (m *MemoryCache) Delete(ctx context.Context, keys ...string) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	for _, k := range keys {
		delete(m.items, k)
	}
	return nil
}

func (m *MemoryCache) FlushPattern(ctx context.Context, pattern string) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	prefix := strings.TrimSuffix(pattern, "*")
	for k := range m.items {
		if strings.HasPrefix(k, prefix) {
			delete(m.items, k)
		}
	}
	return nil
}

func (m *MemoryCache) IsAvailable() bool {
	return true
}

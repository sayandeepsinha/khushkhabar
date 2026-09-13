package main

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"vartacore/VartaCore/internal/articles"
	"vartacore/VartaCore/internal/background"
	"vartacore/VartaCore/internal/cache"
	"vartacore/VartaCore/internal/catagory"
	"vartacore/VartaCore/internal/config"
	"vartacore/VartaCore/internal/dbactivity"
	"vartacore/VartaCore/internal/user"
	"vartacore/VartaCore/server"
	"vartacore/shared/dbcall"
	"vartacore/shared/logger"
)

func main() {
	logger.Info("Initializing VartaCore Positive News Backend...")

	// 1. Load configuration
	cfg := config.Load()

	// 2. Initialize Database with Resilient Hybrid Fallback
	var (
		db   *sql.DB
		repo dbactivity.Repository
	)

	dbCfg := dbcall.DefaultDBConfig(cfg.MySQLDSN)
	sqlDB, err := dbcall.ConnectMySQL(dbCfg)
	if err != nil {
		logger.Error("MySQL connection failed (%v). Operating in Resilient In-Memory Mode.", err)
		repo = dbactivity.NewRepository(nil)
	} else {
		logger.Info("Connected to MySQL successfully.")
		db = sqlDB
		repo = dbactivity.NewRepository(db)

		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		if err := repo.InitSchema(ctx); err != nil {
			logger.Error("Warning: Failed to auto-migrate database schema: %v", err)
		} else {
			logger.Info("Database schema verified.")
		}
		if err := repo.SeedDefaults(ctx); err != nil {
			logger.Error("Warning: Failed to seed defaults: %v", err)
		}
		cancel()
	}

	if db != nil {
		defer db.Close()
	}

	// 3. Initialize Cache (Redis with In-Memory fallback)
	c := cache.NewCache(cfg.RedisAddr, cfg.RedisPassword, cfg.RedisDB)

	// Invalidate homepage and article caches on startup to purge any stale cached dummy articles
	initCtx, cancelInit := context.WithTimeout(context.Background(), 3*time.Second)
	_ = c.Delete(initCtx, cache.KeyFeaturedArticle, cache.KeyBestArticles, cache.KeyCategories)
	_ = c.FlushPattern(initCtx, "articles:*")
	cancelInit()

	// 4. Initialize Core Domain Services
	catService := catagory.NewService(repo, c)
	artService := articles.NewService(repo, c)
	userService := user.NewService(repo)

	// 5. Initialize HTTP Handlers
	catHandler := catagory.NewHandler(catService)
	artHandler := articles.NewHandler(artService)
	userHandler := user.NewHandler(userService)

	// 6. Start Background News Ingestion Worker
	workerCtx, cancelWorker := context.WithCancel(context.Background())
	defer cancelWorker()

	newsWorker := background.NewWorker(cfg, repo, c)
	newsWorker.Start(workerCtx)

	// 7. Setup API Router & HTTP Server
	apiService := server.NewAPIService(cfg, repo, c, artHandler, catHandler, userHandler)
	httpHandler := apiService.Router()

	addr := fmt.Sprintf(":%s", cfg.Port)
	httpServer := &http.Server{
		Addr:         addr,
		Handler:      httpHandler,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// 8. Graceful Shutdown Listener
	shutdownChan := make(chan os.Signal, 1)
	signal.Notify(shutdownChan, os.Interrupt, syscall.SIGTERM)

	go func() {
		logger.Info("VartaCore API server listening on http://localhost%s (ENV: %s)", addr, cfg.Environment)
		if err := httpServer.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			logger.Error("HTTP server error: %v", err)
			os.Exit(1)
		}
	}()

	<-shutdownChan
	logger.Info("Shutting down VartaCore server...")

	cancelWorker()

	shutdownCtx, cancelShutdown := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancelShutdown()

	if err := httpServer.Shutdown(shutdownCtx); err != nil {
		logger.Error("Server shutdown error: %v", err)
	}

	logger.Info("VartaCore server gracefully stopped.")
}

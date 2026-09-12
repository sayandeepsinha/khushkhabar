package main

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"log"
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
	"vartacore/common"
)

func main() {
	log.Println("Initializing VartaCore Positive News Backend...")

	// 1. Load configuration
	cfg := config.Load()

	// 2. Initialize Database with Resilient Hybrid Fallback
	var (
		db   *sql.DB
		repo dbactivity.Repository
	)

	dbCfg := common.DefaultDBConfig(cfg.MySQLDSN)
	sqlDB, err := common.ConnectMySQL(dbCfg)
	if err != nil {
		log.Printf("MySQL connection failed (%v). Operating in Resilient In-Memory Mode.", err)
		repo = dbactivity.NewRepository(nil)
	} else {
		log.Println("Connected to MySQL successfully.")
		db = sqlDB
		repo = dbactivity.NewRepository(db)

		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		if err := repo.InitSchema(ctx); err != nil {
			log.Printf("Warning: Failed to auto-migrate database schema: %v", err)
		} else {
			log.Println("Database schema verified.")
		}
		if err := repo.SeedDefaults(ctx); err != nil {
			log.Printf("Warning: Failed to seed defaults: %v", err)
		}
		cancel()
	}

	if db != nil {
		defer db.Close()
	}

	// 3. Initialize Cache (Redis with In-Memory fallback)
	c := cache.NewCache(cfg.RedisAddr, cfg.RedisPassword, cfg.RedisDB)

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
		log.Printf("VartaCore API server listening on http://localhost%s (ENV: %s)", addr, cfg.Environment)
		if err := httpServer.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("HTTP server error: %v", err)
		}
	}()

	<-shutdownChan
	log.Println("Shutting down VartaCore server...")

	cancelWorker()

	shutdownCtx, cancelShutdown := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancelShutdown()

	if err := httpServer.Shutdown(shutdownCtx); err != nil {
		log.Printf("Server shutdown error: %v", err)
	}

	log.Println("VartaCore server gracefully stopped.")
}

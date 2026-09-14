package background

import (
	"context"
	"time"

	"vartacore/VartaCore/internal/cache"
	"vartacore/VartaCore/internal/config"
	"vartacore/VartaCore/internal/dbactivity"
	"vartacore/shared/logger"
)

// Worker handles background news ingestion and scheduled synchronization
type Worker struct {
	cfg   *config.Config
	repo  dbactivity.Repository
	cache cache.Cacher
}

// NewWorker initializes a new background ingestion worker
func NewWorker(cfg *config.Config, repo dbactivity.Repository, c cache.Cacher) *Worker {
	return &Worker{
		cfg:   cfg,
		repo:  repo,
		cache: c,
	}
}

// Start launches the background scheduler and ticker service
func (w *Worker) Start(ctx context.Context) {
	logger.Info("Starting VartaCore background news worker (Interval: %v)", w.cfg.NewsFetchInterval)

	// Run initial ingestion asynchronously on startup
	go func() {
		time.Sleep(1 * time.Second)
		w.RunPipeline(ctx)
	}()

	ticker := time.NewTicker(w.cfg.NewsFetchInterval)
	go func() {
		defer ticker.Stop()
		for {
			select {
			case <-ctx.Done():
				logger.Info("Stopping VartaCore news worker...")
				return
			case <-ticker.C:
				w.RunPipeline(ctx)
			}
		}
	}()
}

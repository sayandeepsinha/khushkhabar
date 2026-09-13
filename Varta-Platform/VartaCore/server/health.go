package server

import (
	"net/http"
	"time"

	"vartacore/VartaCore/dto"
	"vartacore/shared/common"
)

// HealthChecker checks whether cache/dependencies are available
type HealthChecker interface {
	IsAvailable() bool
}

// HealthHandler handles the /api/health endpoint
type HealthHandler struct {
	checker   HealthChecker
	startTime time.Time
}

// NewHealthHandler creates a new health handler
func NewHealthHandler(checker HealthChecker, startTime time.Time) *HealthHandler {
	return &HealthHandler{
		checker:   checker,
		startTime: startTime,
	}
}

// ServeHTTP writes the health check DTO response
func (h *HealthHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	redisStatus := "connected"
	if h.checker != nil && !h.checker.IsAvailable() {
		redisStatus = "in-memory-fallback"
	}

	res := dto.HealthResponse{
		Status:    "healthy",
		Service:   "VartaCore API",
		Version:   "1.0.0",
		Uptime:    time.Since(h.startTime).String(),
		Cache:     redisStatus,
		Timestamp: time.Now().UTC().Format(time.RFC3339),
	}

	common.WriteJSON(w, http.StatusOK, res)
}

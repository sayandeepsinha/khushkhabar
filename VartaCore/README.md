# VartaCore — Positive & Progress News Engine

VartaCore is the modular, high-performance Go backend powering the Varta positive news platform. It features continuous automated news ingestion from curated RSS feeds, smart positivity classification and scoring, Redis caching, MySQL persistence with seamless in-memory fallback, and full Docker Compose support for local Mac development and production hosting.

---

## Architecture Overview

```
                          Internet
                             │
                             ▼
                    ┌─────────────────┐
                    │  Reverse Proxy  │ (Caddy / Nginx)
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   VartaCore     │ (Go net/http Modular Monolith)
                    │   HTTP API      │
                    └────┬───────┬────┘
                         │       │
                ┌────────┘       └────────┐
                ▼                         ▼
         ┌─────────────┐           ┌─────────────┐
         │ Redis Cache │           │ MySQL DB    │
         └─────────────┘           └─────────────┘
                                          ▲
                                          │
                                 ┌────────┴────────┐
                                 │ Background News │
                                 │ Ingestion Worker│
                                 └────────┬────────┘
                                          │
                                          ▼
                                Curated RSS Feeds & APIs
```

### Key Capabilities
- **Resilient Hybrid Fallback**: VartaCore automatically detects whether MySQL and Redis are running. If they are offline during local Mac development, it seamlessly falls back to a thread-safe in-memory store so you can build and test immediately without configuring databases first!
- **100% Free Continuous News**: Ingests uplifting, progress-focused news from curated RSS feeds (Good News Network, Positive News UK, Optimist Daily, BBC Science & Environment) around the clock without requiring paid API subscriptions.
- **Smart Positivity Engine**: Heuristically scores stories on Sentiment, Impact, and Solutions (0–100 scale), filters out tragedy/catastrophe reporting, and assigns uplift badges. Optionally connects to Google Gemini (`GEMINI_API_KEY`) for AI summarization.
- **Pure Standard Library Routing**: Built with modern Go standard library `net/http` method and pattern routing (`GET /api/articles/{id}`), keeping the application lightweight, minimal, and blazingly fast.

---

## Directory Structure

VartaCore adheres strictly to the modular monolith layout:

```
VartaCore/
├── common/                     # Cross-cutting utilities and DB pool
│   ├── common.go               # JSON response wrappers, ID & slug helpers
│   ├── common_test.go          # Tests for common utilities
│   └── dbcall.go               # MySQL connection pooling and ping checks
├── VartaCore/
│   ├── main/
│   │   └── main.go             # Application entrypoint and lifecycle
│   ├── server/
│   │   ├── apiservice.go       # Route definitions and health check
│   │   ├── apiservice_test.go  # Route integration tests
│   │   └── middleware.go       # CORS, Logging, and Panic Recovery
│   └── internal/
│       ├── config/             # Environment configuration loader
│       ├── dbactivity/         # Database migrations, repository & in-memory store
│       ├── cache/              # Redis client & thread-safe in-memory cache
│       ├── articles/           # Articles domain, service & HTTP handlers
│       ├── catagory/           # Categories domain, service & HTTP handlers
│       ├── user/               # User authentication, preferences & profile
│       ├── processing/         # Classification, scoring & Gemini integration
│       └── background/         # Scheduled RSS fetcher & ingestion pipeline
├── Dockerfile                  # Multi-stage lightweight production container
├── docker-compose.yml          # One-command orchestration (Go, MySQL, Redis, Caddy)
├── Caddyfile                   # Reverse proxy configuration
├── .env.example                # Example environment settings
└── go.mod                      # Go module definitions
```

---

## Quickstart & Running Locally

### Option 1: Run directly on your Mac (Instant / In-Memory Mode)

You can run VartaCore immediately without starting any containers:

```bash
cd VartaCore
export PATH=$PATH:/usr/local/go/bin
go run ./VartaCore/main/main.go
```

Output:
```
Initializing VartaCore Positive News Backend...
MySQL connection failed. Operating in Resilient In-Memory Mode.
Redis unavailable; operating in resilient in-memory cache mode
Starting VartaCore background news worker (Interval: 15m)
VartaCore API server listening on http://localhost:8080 (ENV: development)
```

### Option 2: Run full stack with Docker Compose

Launch Go backend, MySQL 8, Redis 7, and Caddy with a single command:

```bash
cd VartaCore
docker compose up -d --build
```

- API Base URL: `http://localhost:8080/api`
- Caddy Reverse Proxy: `http://localhost`
- MySQL: Port `3306` (`root:vartapass`)
- Redis: Port `6379`

To view logs:
```bash
docker compose logs -f backend
```

---

## API Endpoints

### System & Health
- `GET /api/health` — Checks service health, uptime, and cache status.

### Categories
- `GET /api/categories` — Retrieves all news categories with article counts.

### Articles
- `GET /api/articles` — Lists published articles. Supports query params:
  - `?category=science` (category slug)
  - `?search=solar` (search keyword)
  - `?limit=30&offset=0` (pagination)
- `GET /api/articles/featured` — Returns the top featured positive story.
- `GET /api/articles/best` — Returns top positive articles ("Best of the Week").
- `GET /api/articles/{id}` — Returns a specific article by ID.
- `POST /api/articles/{id}/bookmark` — Toggles bookmark state for the active user.

### Authentication & Preferences
- `POST /api/auth/login` — User login (`{ "email": "...", "password": "..." }`).
- `POST /api/auth/register` — User signup (`{ "name": "...", "email": "...", "password": "..." }`).
- `POST /api/auth/logout` — Logout.
- `GET /api/user/preferences` — Get user category preferences & reading settings.
- `PUT /api/user/preferences` — Update preferences.
- `DELETE /api/user/account` — Delete account and user data.

---

## Running Automated Tests

```bash
export PATH=$PATH:/usr/local/go/bin
go test -v ./...
```

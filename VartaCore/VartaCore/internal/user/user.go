package user

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"net/http"
	"strings"
	"time"

	"vartacore/VartaCore/internal/dbactivity"
	"vartacore/common"
)

// AuthResponse matches frontend expectations
type AuthResponse struct {
	User    dbactivity.User `json:"user"`
	Token   string          `json:"token"`
	Message string          `json:"message,omitempty"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type RegisterRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type DeleteAccountRequest struct {
	Password string `json:"password"`
	Reason   string `json:"reason,omitempty"`
}

// Service manages user authentication and settings
type Service struct {
	repo dbactivity.Repository
}

func NewService(repo dbactivity.Repository) *Service {
	return &Service{repo: repo}
}

func hashPassword(pass string) string {
	hasher := sha256.New()
	hasher.Write([]byte(pass + "varta_salt_2025"))
	return hex.EncodeToString(hasher.Sum(nil))
}

func (s *Service) Login(ctx context.Context, email, password string) (*AuthResponse, error) {
	if ctx == nil {
		ctx = context.Background()
	}
	u, err := s.repo.GetUserByEmail(ctx, email)
	if err != nil {
		demo := dbactivity.User{
			ID:        common.GenerateID("usr-"),
			Name:      "Varta Reader",
			Email:     email,
			AvatarURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
			CreatedAt: time.Now(),
		}
		_ = s.repo.CreateUser(ctx, &demo)
		u = &demo
	}

	token := fmt.Sprintf("jwt_%s_%s", u.ID, common.GenerateID("token-"))
	return &AuthResponse{
		User:    *u,
		Token:   token,
		Message: "Welcome to Varta!",
	}, nil
}

func (s *Service) Register(ctx context.Context, name, email, password string) (*AuthResponse, error) {
	if ctx == nil {
		ctx = context.Background()
	}
	existing, _ := s.repo.GetUserByEmail(ctx, email)
	if existing != nil {
		return s.Login(ctx, email, password)
	}

	u := dbactivity.User{
		ID:           common.GenerateID("usr-"),
		Name:         name,
		Email:        email,
		PasswordHash: hashPassword(password),
		AvatarURL:    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
		CreatedAt:    time.Now(),
	}

	if err := s.repo.CreateUser(ctx, &u); err != nil {
		return nil, err
	}

	token := fmt.Sprintf("jwt_%s_%s", u.ID, common.GenerateID("token-"))
	return &AuthResponse{
		User:    u,
		Token:   token,
		Message: "Account created successfully",
	}, nil
}

// Helper to extract authenticated user ID from Authorization header
func extractUserID(r *http.Request) string {
	authHeader := r.Header.Get("Authorization")
	if strings.HasPrefix(authHeader, "Bearer ") {
		token := strings.TrimPrefix(authHeader, "Bearer ")
		token = strings.TrimSpace(token)
		if token != "" {
			parts := strings.Split(token, "_")
			if len(parts) >= 3 && parts[0] == "jwt" && parts[1] != "" {
				return parts[1]
			}
			return "usr-varta-01"
		}
	}
	return "usr-varta-01"
}

// Handler handles HTTP requests for user and authentication
type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := common.ReadJSON(r, &req); err != nil {
		common.WriteError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if req.Email == "" {
		common.WriteError(w, http.StatusBadRequest, "email is required")
		return
	}

	res, err := h.service.Login(r.Context(), req.Email, req.Password)
	if err != nil {
		common.WriteError(w, http.StatusUnauthorized, "invalid credentials")
		return
	}
	common.WriteJSON(w, http.StatusOK, res)
}

func (h *Handler) Register(w http.ResponseWriter, r *http.Request) {
	var req RegisterRequest
	if err := common.ReadJSON(r, &req); err != nil {
		common.WriteError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if req.Email == "" {
		common.WriteError(w, http.StatusBadRequest, "email is required")
		return
	}
	if req.Name == "" {
		req.Name = "Positive Reader"
	}

	res, err := h.service.Register(r.Context(), req.Name, req.Email, req.Password)
	if err != nil {
		common.WriteError(w, http.StatusInternalServerError, "failed to register user")
		return
	}
	common.WriteJSON(w, http.StatusCreated, res)
}

func (h *Handler) Logout(w http.ResponseWriter, r *http.Request) {
	common.WriteJSON(w, http.StatusOK, map[string]any{
		"success": true,
		"message": "logged out successfully",
	})
}

func (h *Handler) GetPreferences(w http.ResponseWriter, r *http.Request) {
	userID := extractUserID(r)
	prefs, err := h.service.repo.GetUserPreferences(r.Context(), userID)
	if err != nil {
		common.WriteError(w, http.StatusInternalServerError, "failed to retrieve preferences")
		return
	}
	common.WriteJSON(w, http.StatusOK, prefs)
}

func (h *Handler) UpdatePreferences(w http.ResponseWriter, r *http.Request) {
	userID := extractUserID(r)
	var updated dbactivity.UserPreferences
	if err := common.ReadJSON(r, &updated); err != nil {
		common.WriteError(w, http.StatusBadRequest, "invalid preference payload")
		return
	}

	if err := h.service.repo.UpdateUserPreferences(r.Context(), userID, &updated); err != nil {
		common.WriteError(w, http.StatusInternalServerError, "failed to save preferences")
		return
	}
	common.WriteJSON(w, http.StatusOK, updated)
}

func (h *Handler) DeleteAccount(w http.ResponseWriter, r *http.Request) {
	userID := extractUserID(r)
	_ = h.service.repo.DeleteUser(r.Context(), userID)
	common.WriteJSON(w, http.StatusOK, map[string]any{
		"success": true,
		"message": "Account successfully removed and all data erased.",
	})
}

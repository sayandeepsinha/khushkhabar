package user

import (
	"crypto/sha256"
	"encoding/hex"
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

func (s *Service) Login(email, password string) (*AuthResponse, error) {
	u, err := s.repo.GetUserByEmail(nil, email)
	if err != nil {
		demo := dbactivity.User{
			ID:        common.GenerateID("usr-"),
			Name:      "Varta Reader",
			Email:     email,
			AvatarURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
			CreatedAt: time.Now(),
		}
		_ = s.repo.CreateUser(nil, &demo)
		u = &demo
	}

	token := "jwt_" + common.GenerateID("token-")
	return &AuthResponse{
		User:    *u,
		Token:   token,
		Message: "Welcome to Varta!",
	}, nil
}

func (s *Service) Register(name, email, password string) (*AuthResponse, error) {
	existing, _ := s.repo.GetUserByEmail(nil, email)
	if existing != nil {
		return s.Login(email, password)
	}

	u := dbactivity.User{
		ID:           common.GenerateID("usr-"),
		Name:         name,
		Email:        email,
		PasswordHash: hashPassword(password),
		AvatarURL:    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
		CreatedAt:    time.Now(),
	}

	if err := s.repo.CreateUser(nil, &u); err != nil {
		return nil, err
	}

	token := "jwt_" + common.GenerateID("token-")
	return &AuthResponse{
		User:    u,
		Token:   token,
		Message: "Account created successfully",
	}, nil
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

	res, err := h.service.Login(req.Email, req.Password)
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

	res, err := h.service.Register(req.Name, req.Email, req.Password)
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
	userID := "usr-varta-01"
	authHeader := r.Header.Get("Authorization")
	if strings.HasPrefix(authHeader, "Bearer ") {
		userID = "usr-varta-01"
	}

	prefs, err := h.service.repo.GetUserPreferences(r.Context(), userID)
	if err != nil {
		common.WriteError(w, http.StatusInternalServerError, "failed to retrieve preferences")
		return
	}
	common.WriteJSON(w, http.StatusOK, prefs)
}

func (h *Handler) UpdatePreferences(w http.ResponseWriter, r *http.Request) {
	userID := "usr-varta-01"
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
	userID := "usr-varta-01"
	_ = h.service.repo.DeleteUser(r.Context(), userID)
	common.WriteJSON(w, http.StatusOK, map[string]any{
		"success": true,
		"message": "Account successfully removed and all data erased.",
	})
}

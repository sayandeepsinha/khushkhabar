package dto

import "vartacore/VartaCore/models"

// HealthResponse represents the health check endpoint response
type HealthResponse struct {
	Status    string `json:"status"`
	Service   string `json:"service"`
	Version   string `json:"version"`
	Uptime    string `json:"uptime"`
	Cache     string `json:"cache"`
	Timestamp string `json:"timestamp"`
}

// LoginRequest is the payload for user login
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// RegisterRequest is the payload for creating a new user account
type RegisterRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

// DeleteAccountRequest is the payload for account removal
type DeleteAccountRequest struct {
	Password string `json:"password"`
	Reason   string `json:"reason,omitempty"`
}

// AuthResponse is returned on successful login or registration
type AuthResponse struct {
	User    models.User `json:"user"`
	Token   string      `json:"token"`
	Message string      `json:"message,omitempty"`
}

// BookmarkResponse represents the toggle bookmark status
type BookmarkResponse struct {
	Bookmarked bool `json:"bookmarked"`
}

// MessageResponse represents standard status/acknowledgement responses
type MessageResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}


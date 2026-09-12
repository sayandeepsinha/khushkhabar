package common

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"regexp"
	"strings"
	"time"
	"unicode"
)

// APIResponse is the standard JSON envelope for responses
type APIResponse[T any] struct {
	Success bool   `json:"success"`
	Data    T      `json:"data"`
	Message string `json:"message,omitempty"`
}

// WriteJSON sends a JSON response with status code
func WriteJSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(data)
}

// WriteSuccess sends a standard success APIResponse
func WriteSuccess[T any](w http.ResponseWriter, status int, data T, message ...string) {
	msg := ""
	if len(message) > 0 {
		msg = message[0]
	}
	WriteJSON(w, status, APIResponse[T]{
		Success: true,
		Data:    data,
		Message: msg,
	})
}

// WriteError sends an error message in standard API format
func WriteError(w http.ResponseWriter, status int, message string) {
	WriteJSON(w, status, map[string]any{
		"success": false,
		"message": message,
	})
}

// ReadJSON decodes the request body into target struct
func ReadJSON(r *http.Request, dst any) error {
	defer r.Body.Close()
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	return decoder.Decode(dst)
}

// GenerateID creates a random hexadecimal ID with a given prefix (e.g., "art-", "usr-", "cat-")
func GenerateID(prefix string) string {
	bytes := make([]byte, 8)
	if _, err := rand.Read(bytes); err != nil {
		return fmt.Sprintf("%s%d", prefix, time.Now().UnixNano())
	}
	return fmt.Sprintf("%s%s", prefix, hex.EncodeToString(bytes))
}

// Slugify converts a string title into a clean URL-friendly slug
func Slugify(s string) string {
	s = strings.ToLower(s)
	// Remove non-alphanumeric chars
	reg := regexp.MustCompile("[^a-z0-9]+")
	s = reg.ReplaceAllString(s, "-")
	return strings.Trim(s, "-")
}

// CalculateReadingTime estimates reading time in minutes (approx. 200 words per minute)
func CalculateReadingTime(text string) int {
	words := strings.FieldsFunc(text, func(r rune) bool {
		return unicode.IsSpace(r)
	})
	count := len(words)
	minutes := count / 200
	if count%200 != 0 || minutes == 0 {
		minutes++
	}
	return minutes
}

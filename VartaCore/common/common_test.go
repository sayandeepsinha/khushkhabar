package common

import (
	"strings"
	"testing"
)

func TestSlugify(t *testing.T) {
	tests := []struct {
		input    string
		expected string
	}{
		{"Planet & Climate", "planet-climate"},
		{"Science & Discovery!", "science-discovery"},
		{"  Multiple   Spaces   Here  ", "multiple-spaces-here"},
		{"Hello World 123", "hello-world-123"},
	}

	for _, tt := range tests {
		got := Slugify(tt.input)
		if got != tt.expected {
			t.Errorf("Slugify(%q) = %q, want %q", tt.input, got, tt.expected)
		}
	}
}

func TestGenerateID(t *testing.T) {
	id := GenerateID("art-")
	if !strings.HasPrefix(id, "art-") {
		t.Errorf("Expected prefix art-, got %s", id)
	}
	if len(id) < 10 {
		t.Errorf("Expected id length >= 10, got %d", len(id))
	}
}

func TestCalculateReadingTime(t *testing.T) {
	shortText := "One two three four five."
	if CalculateReadingTime(shortText) != 1 {
		t.Errorf("Expected 1 min for short text, got %d", CalculateReadingTime(shortText))
	}

	// 400 words should be 2 mins
	longText := strings.Repeat("word ", 400)
	if CalculateReadingTime(longText) != 2 {
		t.Errorf("Expected 2 mins for 400 words, got %d", CalculateReadingTime(longText))
	}
}

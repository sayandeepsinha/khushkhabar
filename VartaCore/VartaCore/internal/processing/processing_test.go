package processing

import (
	"testing"
)

func TestStripHTML(t *testing.T) {
	input := "<p>This is <strong>amazing</strong> news &amp; breakthrough!</p>"
	expected := "This is amazing news & breakthrough!"
	got := StripHTML(input)
	if got != expected {
		t.Errorf("StripHTML expected %q, got %q", expected, got)
	}
}

func TestClassifyCategory(t *testing.T) {
	tests := []struct {
		name     string
		text     string
		wantSlug string
	}{
		{
			name:     "Solar and clean energy",
			text:     "Major breakthrough in solar panels and wind energy saves millions of tons of carbon",
			wantSlug: "planet",
		},
		{
			name:     "Medical research",
			text:     "Clinical trial shows cancer vaccine causes complete remission in patients",
			wantSlug: "health",
		},
		{
			name:     "Space astronomy",
			text:     "NASA telescope scientists discover new earth-like planet in distant galaxy",
			wantSlug: "science",
		},
		{
			name:     "Bionic robotics",
			text:     "Open-source bionic robotic prosthetic hand built by high school students",
			wantSlug: "innovation",
		},
		{
			name:     "Community hero",
			text:     "Neighbors volunteer and donate tuition money to elderly school crossing guard",
			wantSlug: "kindness",
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			slug, _ := ClassifyCategory(tc.text)
			if slug != tc.wantSlug {
				t.Errorf("ClassifyCategory() got slug %q, want %q", slug, tc.wantSlug)
			}
		})
	}
}

func TestScorePositivity(t *testing.T) {
	// 1. Positive news
	title := "Historic milestone: scientists develop clean energy breakthrough"
	summary := "Over 40 countries celebrate solar expansion and wildlife recovery"
	score, badge, isPositive := ScorePositivity(title, summary, "Good News Network")
	if !isPositive {
		t.Errorf("Expected isPositive to be true")
	}
	if score < 80 {
		t.Errorf("Expected positivity score >= 80, got %d", score)
	}
	if badge == "" {
		t.Errorf("Expected uplift badge to be set")
	}

	// 2. Tragedy filter test
	badTitle := "5 killed in horrific highway crash kills multiple drivers"
	badText := "Authorities report disaster and fatal catastrophe"
	badScore, _, badPositive := ScorePositivity(badTitle, badText, "Random Wire")
	if badPositive {
		t.Errorf("Expected tragedy article to be filtered out, got positive=true")
	}
	if badScore >= 70 {
		t.Errorf("Expected low score for tragedy, got %d", badScore)
	}
}

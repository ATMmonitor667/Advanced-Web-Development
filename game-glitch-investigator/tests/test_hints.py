"""
Tests for the hint system (fixed/hints.py).

Run with:  pytest tests/test_hints.py -v
These tests expose the bugs in buggy/hints.py and pass against fixed/hints.py.
"""

import sys
import os
import pytest

# Point to the fixed module
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "fixed"))
from hints import get_directional_hint, get_proximity_hint, get_hint


# ──────────────────────────────────────────────
# Directional hints
# ──────────────────────────────────────────────

class TestDirectionalHint:
    def test_guess_too_high_says_high(self):
        """When guess > secret the hint must say 'high' and steer player lower."""
        result = get_directional_hint(80, 50)
        assert "high" in result.lower(), (
            f"Guess 80 > secret 50: expected 'high' in hint, got: '{result}'"
        )
        assert "lower" in result.lower() or "down" in result.lower(), (
            f"Expected hint to suggest going lower, got: '{result}'"
        )

    def test_guess_too_low_says_low(self):
        """When guess < secret the hint must say 'low' and steer player higher."""
        result = get_directional_hint(20, 50)
        assert "low" in result.lower(), (
            f"Guess 20 < secret 50: expected 'low' in hint, got: '{result}'"
        )
        assert "higher" in result.lower() or "up" in result.lower(), (
            f"Expected hint to suggest going higher, got: '{result}'"
        )

    def test_exact_match_says_spot_on(self):
        result = get_directional_hint(50, 50)
        assert result == "Spot on!"

    def test_hints_are_not_inverted(self):
        """Critical regression: hints must not be backwards."""
        too_high = get_directional_hint(99, 1)   # vastly above secret
        too_low  = get_directional_hint(1,  99)  # vastly below secret

        assert too_high != too_low, "Hints for opposite extremes should differ"
        assert "high" in too_high.lower(), (
            f"Guess 99, secret 1 → should say too HIGH. Got: '{too_high}'"
        )
        assert "low" in too_low.lower(), (
            f"Guess 1, secret 99 → should say too LOW. Got: '{too_low}'"
        )


# ──────────────────────────────────────────────
# Proximity hints
# ──────────────────────────────────────────────

class TestProximityHint:
    def test_exact_match_is_burning_hot(self):
        result = get_proximity_hint(50, 50)
        assert "hot" in result.lower() or "burning" in result.lower()

    def test_distance_5_is_very_warm(self):
        """Boundary value: distance exactly 5 should be 'Very warm!', not 'Warm.'"""
        result = get_proximity_hint(45, 50)   # distance = 5
        assert "very warm" in result.lower(), (
            f"Distance 5 should be 'Very warm!', got: '{result}'"
        )

    def test_distance_15_is_warm(self):
        """Boundary value: distance exactly 15 should be 'Warm.', not 'Cold...'"""
        result = get_proximity_hint(35, 50)   # distance = 15
        assert result == "Warm.", (
            f"Distance 15 should be 'Warm.', got: '{result}'"
        )

    def test_distance_30_is_cold(self):
        """Boundary value: distance exactly 30 should be 'Cold...', not 'Freezing!'"""
        result = get_proximity_hint(20, 50)   # distance = 30
        assert result == "Cold...", (
            f"Distance 30 should be 'Cold...', got: '{result}'"
        )

    def test_far_away_is_freezing(self):
        result = get_proximity_hint(1, 100)   # distance = 99
        assert "freez" in result.lower()


# ──────────────────────────────────────────────
# Combined hint
# ──────────────────────────────────────────────

class TestGetHint:
    def test_correct_guess_returns_correct(self):
        assert get_hint(50, 50) == "Correct!"

    def test_wrong_guess_contains_directional_info(self):
        result = get_hint(80, 50)
        assert "high" in result.lower(), f"Expected direction hint, got: '{result}'"

    def test_wrong_guess_contains_proximity_info(self):
        result = get_hint(49, 50)   # distance = 1, very warm
        assert "warm" in result.lower() or "hot" in result.lower(), (
            f"Expected proximity hint, got: '{result}'"
        )

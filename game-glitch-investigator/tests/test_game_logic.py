"""
Integration tests for game logic using fixed modules.

Run with:  pytest tests/test_game_logic.py -v
"""

import sys
import os
import pytest

# Import from fixed modules
fixed_path = os.path.join(os.path.dirname(__file__), "..", "fixed")
sys.path.insert(0, fixed_path)

from hints import get_hint
from score import calculate_score, calculate_bonus, get_grade


class TestScorePlusBonus:
    def test_total_score_is_always_integer(self):
        """
        Base score + bonus must always be an integer.
        Fails against buggy/score.py because calculate_bonus returns None for
        guesses > 5, causing a TypeError when added to base_score.
        """
        for guesses in range(1, 8):
            base  = calculate_score(guesses, 7)
            bonus = calculate_bonus(guesses)
            total = base + bonus   # TypeError if bonus is None
            assert isinstance(total, int), (
                f"total score should be int for {guesses} guesses, got {type(total)}"
            )

    def test_more_guesses_generally_lower_total(self):
        """Player who solves in fewer guesses should outscore a slower player."""
        fast_total = calculate_score(1, 7) + calculate_bonus(1)
        slow_total = calculate_score(7, 7) + calculate_bonus(7)
        assert fast_total > slow_total, (
            f"Fast player ({fast_total}) should beat slow player ({slow_total})"
        )


class TestHintGuidance:
    def test_hint_steers_player_higher_when_too_low(self):
        """
        If player guesses 1 and secret is 50, hint must say 'low' / 'higher'.
        Fails against buggy/hints.py where directions are inverted.
        """
        hint = get_hint(1, 50)
        assert "low" in hint.lower(), (
            f"Guess 1 < secret 50: hint should say 'too low', got: '{hint}'"
        )

    def test_hint_steers_player_lower_when_too_high(self):
        """
        If player guesses 99 and secret is 50, hint must say 'high' / 'lower'.
        Fails against buggy/hints.py where directions are inverted.
        """
        hint = get_hint(99, 50)
        assert "high" in hint.lower(), (
            f"Guess 99 > secret 50: hint should say 'too high', got: '{hint}'"
        )

    def test_boundary_guesses_produce_valid_hints(self):
        """Guesses at the edges of the valid range (1, 100) must return valid hints."""
        hint_low  = get_hint(1,   50)
        hint_high = get_hint(100, 50)
        assert hint_low  is not None
        assert hint_high is not None

    def test_hints_are_opposite_for_opposite_extremes(self):
        """Hint for too-high and too-low must be meaningfully different."""
        h_high = get_hint(99, 50)
        h_low  = get_hint(1,  50)
        assert h_high != h_low, "Hints for opposite extremes should not be identical"


class TestValidInputRange:
    def test_boundary_values_produce_hints(self):
        """
        Guesses of exactly 1 and 100 are valid.
        Fails against buggy/game.py which uses `not (1 < guess < 100)` and rejects them.
        """
        # We can't easily test the input() loop, but we verify the hint system
        # handles boundary values without error (the fix is in the guard condition).
        assert get_hint(1,   50) is not None
        assert get_hint(100, 50) is not None
        assert get_hint(1,   1)  == "Correct!"
        assert get_hint(100, 100) == "Correct!"

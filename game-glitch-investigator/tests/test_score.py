"""
Tests for the scoring system (fixed/score.py).

Run with:  pytest tests/test_score.py -v
These tests expose the bugs in buggy/score.py and pass against fixed/score.py.
"""

import sys
import os
import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "fixed"))
from score import calculate_score, calculate_bonus, get_grade


# ──────────────────────────────────────────────
# calculate_score
# ──────────────────────────────────────────────

class TestCalculateScore:
    def test_one_guess_gives_max_score(self):
        """Solving in 1 guess out of 7 should give the highest possible score."""
        score = calculate_score(1, 7)
        assert score == 100, f"1-guess solve should score 100, got {score}"

    def test_all_guesses_gives_lowest_score(self):
        """Using every guess should give the lowest score."""
        score_first = calculate_score(1, 7)
        score_last  = calculate_score(7, 7)
        assert score_last < score_first, (
            f"Using all guesses should score lower than solving on guess 1. "
            f"Got first={score_first}, last={score_last}"
        )

    def test_fewer_guesses_means_higher_score(self):
        """Core requirement: score strictly decreases as guesses increase."""
        scores = [calculate_score(g, 7) for g in range(1, 8)]
        for i in range(len(scores) - 1):
            assert scores[i] >= scores[i + 1], (
                f"Score should not increase with more guesses. scores={scores}"
            )

    def test_score_always_in_valid_range(self):
        """Score must always be between 0 and 100."""
        for guesses in range(1, 8):
            score = calculate_score(guesses, 7)
            assert 0 <= score <= 100, (
                f"Score {score} out of [0, 100] range for {guesses} guesses"
            )


# ──────────────────────────────────────────────
# calculate_bonus
# ──────────────────────────────────────────────

class TestCalculateBonus:
    def test_perfect_guess_bonus_is_50(self):
        assert calculate_bonus(1) == 50

    def test_two_guess_bonus_is_20(self):
        assert calculate_bonus(2) == 20

    def test_three_guess_bonus_is_20(self):
        assert calculate_bonus(3) == 20

    def test_four_guess_bonus_is_10(self):
        assert calculate_bonus(4) == 10

    def test_five_guess_bonus_is_10(self):
        assert calculate_bonus(5) == 10

    def test_six_or_more_guesses_no_bonus(self):
        assert calculate_bonus(6) == 0
        assert calculate_bonus(7) == 0

    def test_bonus_is_never_none(self):
        """Critical: bonus must always be an int, never None."""
        for guesses in range(1, 8):
            result = calculate_bonus(guesses)
            assert result is not None, (
                f"calculate_bonus({guesses}) returned None — missing return statement!"
            )
            assert isinstance(result, int), (
                f"Expected int from calculate_bonus({guesses}), got {type(result)}"
            )

    def test_bonus_is_non_negative(self):
        for guesses in range(1, 8):
            assert calculate_bonus(guesses) >= 0, (
                f"Bonus should never be negative, got {calculate_bonus(guesses)} for {guesses} guesses"
            )


# ──────────────────────────────────────────────
# get_grade
# ──────────────────────────────────────────────

class TestGetGrade:
    @pytest.mark.parametrize("score,expected", [
        (100, "A+"),
        (90,  "A+"),
        (89,  "A"),
        (80,  "A"),
        (79,  "B"),
        (70,  "B"),
        (69,  "C"),
        (60,  "C"),
        (59,  "D"),
        (50,  "D"),
        (49,  "F"),
        (0,   "F"),
    ])
    def test_grade_boundaries(self, score, expected):
        result = get_grade(score)
        assert result == expected, f"Score {score}: expected {expected}, got {result}"

"""
Score calculation for Number Detective — FIXED version.

Fixes applied:
  - calculate_score: inverted formula corrected — fewer guesses now gives higher score.
  - calculate_bonus: added explicit `return 0` so function never returns None.
"""

MAX_SCORE = 100
BONUS_MULTIPLIER = 10


def calculate_score(guesses_used, max_guesses):
    """
    Calculate score based on how many guesses were used.
    Fewer guesses = higher score.
    """
    # FIXED: higher score for fewer guesses
    score = ((max_guesses - guesses_used + 1) / max_guesses) * MAX_SCORE
    return round(score)


def calculate_bonus(guesses_used):
    """Awards bonus points for solving quickly."""
    if guesses_used == 1:
        return BONUS_MULTIPLIER * 5   # 50 bonus for perfect guess
    elif guesses_used <= 3:
        return BONUS_MULTIPLIER * 2   # 20 bonus for quick solve
    elif guesses_used <= 5:
        return BONUS_MULTIPLIER       # 10 bonus for decent solve
    return 0  # FIXED: explicit return 0 instead of implicit None


def get_grade(score):
    """Returns a letter grade based on final score."""
    if score >= 90:
        return "A+"
    elif score >= 80:
        return "A"
    elif score >= 70:
        return "B"
    elif score >= 60:
        return "C"
    elif score >= 50:
        return "D"
    else:
        return "F"

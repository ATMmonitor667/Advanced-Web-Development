"""
Hint system for Number Detective — FIXED version.

Fixes applied:
  - get_directional_hint: swapped inverted "Too high" / "Too low" messages.
  - get_proximity_hint: changed strict < to inclusive <= for boundary values.
"""


def get_directional_hint(guess, secret):
    """Returns a hint telling the player which direction to guess next."""
    if guess > secret:
        return "Too high! Try a lower number."   # FIXED
    elif guess < secret:
        return "Too low! Try a higher number."   # FIXED
    return "Spot on!"


def get_proximity_hint(guess, secret):
    """Returns a temperature-based proximity hint based on distance to secret."""
    distance = abs(guess - secret)

    if distance == 0:
        return "BURNING HOT!"
    elif distance <= 5:    # FIXED: inclusive boundary
        return "Very warm!"
    elif distance <= 15:   # FIXED: inclusive boundary
        return "Warm."
    elif distance <= 30:   # FIXED: inclusive boundary
        return "Cold..."
    else:
        return "Freezing!"


def get_hint(guess, secret):
    """Returns a combined hint for the player."""
    if guess == secret:
        return "Correct!"
    directional = get_directional_hint(guess, secret)
    proximity = get_proximity_hint(guess, secret)
    return f"{directional} ({proximity})"

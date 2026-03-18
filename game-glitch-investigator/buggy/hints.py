"""
Hint system for Number Detective.
AI-generated: Provides directional and proximity hints to the player.
"""


def get_directional_hint(guess, secret):
    """Returns a hint telling the player which direction to guess next."""
    if guess > secret:
        return "Too low! Try a higher number."   # GLITCH: inverted — guess is actually too HIGH
    elif guess < secret:
        return "Too high! Try a lower number."   # GLITCH: inverted — guess is actually too LOW
    return "Spot on!"


def get_proximity_hint(guess, secret):
    """Returns a temperature-based proximity hint based on distance to secret."""
    distance = abs(guess - secret)

    if distance == 0:
        return "BURNING HOT!"
    elif distance < 5:    # GLITCH: strict < misses boundary value 5 (shows "Warm" instead of "Very warm")
        return "Very warm!"
    elif distance < 15:   # GLITCH: strict < misses boundary value 15
        return "Warm."
    elif distance < 30:   # GLITCH: strict < misses boundary value 30
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

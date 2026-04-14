"""
Feature transformation layer.

Converts raw Song attributes into normalised scalar scores [0.0, 1.0]
that can be weighted and summed by the scorer.

Transformation pipeline
-----------------------
raw attribute  →  similarity lookup  →  normalised score  →  scorer
"""

from __future__ import annotations

from typing import Dict, Tuple


# ---------------------------------------------------------------------------
# Genre similarity graph
# Symmetric pairwise similarity scores for related genres.
# Genres not listed together have similarity 0.0 unless they are identical.
# ---------------------------------------------------------------------------

_GENRE_SIMILARITY_MAP: Dict[Tuple[str, str], float] = {
    ("pop",        "r&b"):        0.65,
    ("pop",        "electronic"): 0.50,
    ("pop",        "hip-hop"):    0.40,
    ("pop",        "folk"):       0.35,
    ("rock",       "metal"):      0.70,
    ("rock",       "blues"):      0.60,
    ("rock",       "folk"):       0.45,
    ("rock",       "country"):    0.40,
    ("hip-hop",    "r&b"):        0.75,
    ("hip-hop",    "electronic"): 0.45,
    ("hip-hop",    "pop"):        0.40,
    ("jazz",       "blues"):      0.80,
    ("jazz",       "classical"):  0.35,
    ("jazz",       "r&b"):        0.50,
    ("classical",  "jazz"):       0.35,
    ("classical",  "folk"):       0.30,
    ("electronic", "pop"):        0.50,
    ("electronic", "hip-hop"):    0.45,
    ("country",    "folk"):       0.70,
    ("country",    "rock"):       0.40,
    ("blues",      "jazz"):       0.80,
    ("blues",      "rock"):       0.60,
    ("r&b",        "pop"):        0.65,
    ("r&b",        "hip-hop"):    0.75,
    ("reggae",     "r&b"):        0.45,
    ("reggae",     "pop"):        0.35,
    ("folk",       "country"):    0.70,
    ("folk",       "rock"):       0.45,
    ("metal",      "rock"):       0.70,
}


def genre_similarity(genre_a: str, genre_b: str) -> float:
    """Return a similarity score in [0, 1] between two genre strings.

    1.0  → identical genres
    0.3–0.8 → related genres (see _GENRE_SIMILARITY_MAP)
    0.0  → unrelated genres
    """
    a, b = genre_a.lower(), genre_b.lower()
    if a == b:
        return 1.0
    return _GENRE_SIMILARITY_MAP.get((a, b), _GENRE_SIMILARITY_MAP.get((b, a), 0.0))


# ---------------------------------------------------------------------------
# Mood similarity graph
# Grouped by emotional family.  Moods in the same family share partial sim.
# ---------------------------------------------------------------------------

_MOOD_FAMILIES: Dict[str, str] = {
    # Positive / upbeat
    "happy":      "positive",
    "uplifting":  "positive",
    "romantic":   "positive",
    # High-arousal
    "energetic":  "intense",
    "angry":      "intense",
    # Low-arousal / reflective
    "calm":       "reflective",
    "melancholic":"reflective",
    "nostalgic":  "reflective",
    "sad":        "reflective",
    # Dark
    "dark":       "dark",
}

_SAME_FAMILY_SIMILARITY = 0.55


def mood_similarity(mood_a: str, mood_b: str) -> float:
    """Return a similarity score in [0, 1] between two mood strings.

    1.0  → identical moods
    0.55 → same emotional family
    0.0  → different families
    """
    a, b = mood_a.lower(), mood_b.lower()
    if a == b:
        return 1.0
    family_a = _MOOD_FAMILIES.get(a)
    family_b = _MOOD_FAMILIES.get(b)
    if family_a and family_b and family_a == family_b:
        return _SAME_FAMILY_SIMILARITY
    return 0.0


# ---------------------------------------------------------------------------
# Energy score
# ---------------------------------------------------------------------------

def energy_score(song_energy: float, preferred_energy: float) -> float:
    """Return 1 minus the absolute difference between song and user energies.

    Both values must be in [0, 1].
    Score 1.0 means perfect energy match; 0.0 means maximum mismatch.
    """
    return 1.0 - abs(song_energy - preferred_energy)


# ---------------------------------------------------------------------------
# Genre score for a song against an entire genre preference map
# ---------------------------------------------------------------------------

def compute_genre_score(song_genre: str, preferred_genres: Dict[str, float]) -> float:
    """Compute how well a song's genre fits the user's genre preferences.

    For every genre the user likes, compute:
        preference_weight × genre_similarity(song_genre, preferred_genre)

    Return the maximum across all preferred genres so the song gets credit
    for its best-matching genre preference.

    Returns 0.0 if the user has no genre preferences.
    """
    if not preferred_genres:
        return 0.0
    best = max(
        weight * genre_similarity(song_genre, pref_genre)
        for pref_genre, weight in preferred_genres.items()
    )
    return best


# ---------------------------------------------------------------------------
# Mood score for a song against an entire mood preference map
# ---------------------------------------------------------------------------

def compute_mood_score(song_mood: str, preferred_moods: Dict[str, float]) -> float:
    """Compute how well a song's mood fits the user's mood preferences.

    Same strategy as compute_genre_score: take the max over all preferred
    moods weighted by the user's preference strength.

    Returns 0.0 if the user has no mood preferences.
    """
    if not preferred_moods:
        return 0.0
    best = max(
        weight * mood_similarity(song_mood, pref_mood)
        for pref_mood, weight in preferred_moods.items()
    )
    return best

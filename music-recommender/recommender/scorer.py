"""
Weighted-score recommender algorithm.

The score of a song S for user profile U is:

    score(S, U) = ( w_genre      * genre_score(S, U)
                  + w_mood       * mood_score(S, U)
                  + w_energy     * energy_score(S, U)
                  + w_popularity * S.popularity
                  ) / (w_genre + w_mood + w_energy + w_popularity)

All component scores are in [0, 1], so the final score is also in [0, 1].
Dividing by the sum of weights means the result is correctly normalised even
if the user has customised their feature_weights.

Score breakdown
---------------
feature        | what it measures
---------------|--------------------------------------------------------
genre_score    | How closely the song's genre matches the user's preferred
               | genres, using the genre similarity graph in features.py.
mood_score     | Same but for mood, using mood family similarity.
energy_score   | 1 − |song_energy − preferred_energy| (proximity score).
popularity     | Song's raw platform popularity (0–1).  Acts as a mild
               | tie-breaker and discovery signal.
"""

from __future__ import annotations

from typing import Dict

from .models import Song, UserProfile
from .features import (
    compute_genre_score,
    compute_mood_score,
    energy_score,
)


# ---------------------------------------------------------------------------
# Per-feature score helpers (public so tests can inspect them individually)
# ---------------------------------------------------------------------------

def score_genre(song: Song, profile: UserProfile) -> float:
    """Genre component score in [0, 1]."""
    return compute_genre_score(song.genre, profile.preferred_genres)


def score_mood(song: Song, profile: UserProfile) -> float:
    """Mood component score in [0, 1]."""
    return compute_mood_score(song.mood, profile.preferred_moods)


def score_energy(song: Song, profile: UserProfile) -> float:
    """Energy component score in [0, 1]."""
    return energy_score(song.energy, profile.energy_preference)


def score_popularity(song: Song, _profile: UserProfile) -> float:
    """Popularity component score — just the song's popularity field."""
    return song.popularity


# ---------------------------------------------------------------------------
# Breakdown dictionary
# ---------------------------------------------------------------------------

def compute_feature_scores(song: Song, profile: UserProfile) -> Dict[str, float]:
    """Return all four component scores as a labelled dictionary."""
    return {
        "genre":      score_genre(song, profile),
        "mood":       score_mood(song, profile),
        "energy":     score_energy(song, profile),
        "popularity": score_popularity(song, profile),
    }


# ---------------------------------------------------------------------------
# Composite score
# ---------------------------------------------------------------------------

def compute_score(song: Song, profile: UserProfile) -> float:
    """Compute the final weighted recommendation score in [0, 1].

    Uses the feature_weights stored in *profile* so individual users can
    tune how much each feature matters to their recommendations.

    Returns
    -------
    float
        A value in [0, 1].  Higher is a better fit.
    """
    component_scores = compute_feature_scores(song, profile)
    weights = profile.feature_weights

    total_weight = sum(weights.get(f, 0.0) for f in component_scores)
    if total_weight == 0.0:
        return 0.0

    weighted_sum = sum(
        weights.get(feature, 0.0) * score
        for feature, score in component_scores.items()
    )
    return weighted_sum / total_weight

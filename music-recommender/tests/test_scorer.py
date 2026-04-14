"""Tests for recommender/scorer.py and recommender/features.py"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import pytest
from recommender.models import Song, UserProfile
from recommender.features import genre_similarity, mood_similarity, energy_score
from recommender.scorer import (
    score_genre, score_mood, score_energy, score_popularity,
    compute_feature_scores, compute_score,
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def make_song(**kwargs):
    defaults = dict(
        id="s_test", title="Test", artist="Artist",
        genre="pop", mood="happy", energy=0.6,
        tempo=120, popularity=0.8,
    )
    defaults.update(kwargs)
    return Song(**defaults)


def make_profile(**kwargs):
    defaults = dict(
        user_id="u_test", name="Tester",
        preferred_genres={"pop": 1.0},
        preferred_moods={"happy": 1.0},
        energy_preference=0.6,
        feature_weights={"genre": 0.4, "mood": 0.3, "energy": 0.2, "popularity": 0.1},
    )
    defaults.update(kwargs)
    return UserProfile(**defaults)


# ---------------------------------------------------------------------------
# genre_similarity
# ---------------------------------------------------------------------------

class TestGenreSimilarity:
    def test_identical_genres(self):
        assert genre_similarity("pop", "pop") == 1.0

    def test_case_insensitive(self):
        assert genre_similarity("Pop", "pop") == 1.0

    def test_known_related_genres(self):
        sim = genre_similarity("pop", "r&b")
        assert 0.0 < sim < 1.0

    def test_symmetric(self):
        assert genre_similarity("hip-hop", "r&b") == genre_similarity("r&b", "hip-hop")

    def test_unrelated_genres_zero(self):
        assert genre_similarity("classical", "hip-hop") == 0.0

    def test_rock_metal_high_similarity(self):
        assert genre_similarity("rock", "metal") >= 0.6


# ---------------------------------------------------------------------------
# mood_similarity
# ---------------------------------------------------------------------------

class TestMoodSimilarity:
    def test_identical_moods(self):
        assert mood_similarity("happy", "happy") == 1.0

    def test_same_family_partial(self):
        # happy and uplifting are both "positive"
        sim = mood_similarity("happy", "uplifting")
        assert 0.0 < sim < 1.0

    def test_different_families_zero(self):
        # happy (positive) vs dark (dark)
        assert mood_similarity("happy", "dark") == 0.0

    def test_symmetric(self):
        assert mood_similarity("calm", "melancholic") == mood_similarity("melancholic", "calm")

    def test_energetic_and_angry_same_family(self):
        assert mood_similarity("energetic", "angry") > 0.0


# ---------------------------------------------------------------------------
# energy_score
# ---------------------------------------------------------------------------

class TestEnergyScore:
    def test_perfect_match(self):
        assert energy_score(0.5, 0.5) == pytest.approx(1.0)

    def test_maximum_mismatch(self):
        assert energy_score(1.0, 0.0) == pytest.approx(0.0)
        assert energy_score(0.0, 1.0) == pytest.approx(0.0)

    def test_partial_match(self):
        result = energy_score(0.7, 0.5)
        assert 0.0 < result < 1.0
        assert result == pytest.approx(0.8)


# ---------------------------------------------------------------------------
# score_genre / score_mood / score_energy / score_popularity
# ---------------------------------------------------------------------------

class TestScorerComponents:
    def test_genre_exact_match(self):
        song    = make_song(genre="pop")
        profile = make_profile(preferred_genres={"pop": 1.0})
        assert score_genre(song, profile) == pytest.approx(1.0)

    def test_genre_no_match(self):
        song    = make_song(genre="classical")
        profile = make_profile(preferred_genres={"hip-hop": 1.0})
        assert score_genre(song, profile) == pytest.approx(0.0)

    def test_mood_exact_match(self):
        song    = make_song(mood="calm")
        profile = make_profile(preferred_moods={"calm": 1.0})
        assert score_mood(song, profile) == pytest.approx(1.0)

    def test_energy_component(self):
        song    = make_song(energy=0.5)
        profile = make_profile(energy_preference=0.5)
        assert score_energy(song, profile) == pytest.approx(1.0)

    def test_popularity_component(self):
        song    = make_song(popularity=0.75)
        profile = make_profile()
        assert score_popularity(song, profile) == pytest.approx(0.75)


# ---------------------------------------------------------------------------
# compute_score
# ---------------------------------------------------------------------------

class TestComputeScore:
    def test_perfect_match_score_close_to_one(self):
        """Perfect genre+mood+energy match with high popularity → near 1.0"""
        song = make_song(genre="pop", mood="happy", energy=0.6, popularity=1.0)
        profile = make_profile(
            preferred_genres={"pop": 1.0},
            preferred_moods={"happy": 1.0},
            energy_preference=0.6,
        )
        score = compute_score(song, profile)
        assert score == pytest.approx(1.0)

    def test_score_in_valid_range(self):
        song    = make_song()
        profile = make_profile()
        score   = compute_score(song, profile)
        assert 0.0 <= score <= 1.0

    def test_better_match_scores_higher(self):
        good_song = make_song(genre="pop", mood="happy", energy=0.6, popularity=0.9)
        bad_song  = make_song(genre="classical", mood="dark", energy=0.1, popularity=0.2)
        profile   = make_profile(
            preferred_genres={"pop": 1.0},
            preferred_moods={"happy": 1.0},
            energy_preference=0.6,
        )
        assert compute_score(good_song, profile) > compute_score(bad_song, profile)

    def test_zero_weights_returns_zero(self):
        song    = make_song()
        profile = make_profile(
            feature_weights={"genre": 0.0, "mood": 0.0, "energy": 0.0, "popularity": 0.0}
        )
        assert compute_score(song, profile) == 0.0

    def test_feature_weights_affect_score(self):
        """Doubling genre weight should increase score for a genre-matched song."""
        song = make_song(genre="pop", mood="sad", energy=0.9, popularity=0.2)
        low_genre_profile  = make_profile(
            feature_weights={"genre": 0.1, "mood": 0.4, "energy": 0.4, "popularity": 0.1}
        )
        high_genre_profile = make_profile(
            feature_weights={"genre": 0.8, "mood": 0.1, "energy": 0.05, "popularity": 0.05}
        )
        assert compute_score(song, high_genre_profile) > compute_score(song, low_genre_profile)

    def test_compute_feature_scores_keys(self):
        song    = make_song()
        profile = make_profile()
        scores  = compute_feature_scores(song, profile)
        for key in ("genre", "mood", "energy", "popularity"):
            assert key in scores
            assert 0.0 <= scores[key] <= 1.0

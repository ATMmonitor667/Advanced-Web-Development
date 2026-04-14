"""Tests for recommender/models.py"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import pytest
from recommender.models import Song, UserProfile, DEFAULT_FEATURE_WEIGHTS


class TestSong:
    def _make(self, **kwargs):
        defaults = dict(
            id="s001", title="Test Track", artist="Artist",
            genre="pop", mood="happy", energy=0.5,
            tempo=120, popularity=0.7,
        )
        defaults.update(kwargs)
        return Song(**defaults)

    def test_valid_song_created(self):
        song = self._make()
        assert song.id == "s001"
        assert song.title == "Test Track"

    def test_energy_boundary_values(self):
        self._make(energy=0.0)
        self._make(energy=1.0)

    def test_energy_out_of_range_raises(self):
        with pytest.raises(ValueError):
            self._make(energy=1.1)
        with pytest.raises(ValueError):
            self._make(energy=-0.1)

    def test_popularity_out_of_range_raises(self):
        with pytest.raises(ValueError):
            self._make(popularity=1.5)
        with pytest.raises(ValueError):
            self._make(popularity=-0.01)

    def test_tags_default_empty(self):
        song = self._make()
        assert song.tags == []

    def test_tags_stored(self):
        song = self._make(tags=["chill", "vibes"])
        assert "chill" in song.tags

    def test_repr_contains_title(self):
        song = self._make(title="My Song")
        assert "My Song" in repr(song)


class TestUserProfile:
    def _make(self, **kwargs):
        defaults = dict(
            user_id="u001",
            name="Test User",
            preferred_genres={"pop": 0.9},
            preferred_moods={"happy": 0.8},
            energy_preference=0.6,
        )
        defaults.update(kwargs)
        return UserProfile(**defaults)

    def test_valid_profile_created(self):
        p = self._make()
        assert p.user_id == "u001"
        assert p.name == "Test User"

    def test_default_feature_weights_applied(self):
        p = self._make()
        for key in DEFAULT_FEATURE_WEIGHTS:
            assert key in p.feature_weights

    def test_energy_out_of_range_raises(self):
        with pytest.raises(ValueError):
            self._make(energy_preference=1.2)

    def test_genre_weight_out_of_range_raises(self):
        with pytest.raises(ValueError):
            self._make(preferred_genres={"pop": 1.5})

    def test_mood_weight_out_of_range_raises(self):
        with pytest.raises(ValueError):
            self._make(preferred_moods={"happy": -0.1})

    def test_listening_history_default_empty(self):
        p = self._make()
        assert p.listening_history == []

    def test_custom_feature_weights(self):
        custom = {"genre": 0.6, "mood": 0.2, "energy": 0.1, "popularity": 0.1}
        p = self._make(feature_weights=custom)
        assert p.feature_weights["genre"] == 0.6

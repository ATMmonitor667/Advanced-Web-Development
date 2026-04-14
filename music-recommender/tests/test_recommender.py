"""Tests for recommender/recommender.py"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import pytest
from recommender.models import Song, UserProfile
from recommender.recommender import MusicRecommender


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

def make_song(sid, genre="pop", mood="happy", energy=0.6, popularity=0.7):
    return Song(
        id=sid, title=f"Song {sid}", artist="Artist",
        genre=genre, mood=mood, energy=energy,
        tempo=120, popularity=popularity,
    )


def make_profile(preferred_genres=None, preferred_moods=None,
                 energy_preference=0.6, history=None):
    return UserProfile(
        user_id="u_test", name="Tester",
        preferred_genres=preferred_genres or {"pop": 1.0},
        preferred_moods=preferred_moods or {"happy": 1.0},
        energy_preference=energy_preference,
        listening_history=history or [],
    )


SMALL_CATALOG = [
    make_song("s1", genre="pop",        mood="happy",       energy=0.7, popularity=0.9),
    make_song("s2", genre="rock",       mood="energetic",   energy=0.8, popularity=0.8),
    make_song("s3", genre="jazz",       mood="calm",        energy=0.2, popularity=0.7),
    make_song("s4", genre="classical",  mood="melancholic", energy=0.1, popularity=0.6),
    make_song("s5", genre="pop",        mood="uplifting",   energy=0.75, popularity=0.85),
]


# ---------------------------------------------------------------------------
# Initialisation
# ---------------------------------------------------------------------------

class TestMusicRecommenderInit:
    def test_empty_catalog_raises(self):
        with pytest.raises(ValueError):
            MusicRecommender([])

    def test_catalog_stored(self):
        engine = MusicRecommender(SMALL_CATALOG)
        assert len(engine.catalog) == 5


# ---------------------------------------------------------------------------
# recommend()
# ---------------------------------------------------------------------------

class TestRecommend:
    def setup_method(self):
        self.engine = MusicRecommender(SMALL_CATALOG)

    def test_returns_list_of_tuples(self):
        profile = make_profile()
        results = self.engine.recommend(profile, n=3)
        assert isinstance(results, list)
        for item in results:
            assert len(item) == 2
            assert isinstance(item[0], Song)
            assert isinstance(item[1], float)

    def test_n_limits_results(self):
        profile = make_profile()
        results = self.engine.recommend(profile, n=2)
        assert len(results) == 2

    def test_n_larger_than_catalog_returns_all(self):
        profile = make_profile()
        results = self.engine.recommend(profile, n=100)
        assert len(results) == len(SMALL_CATALOG)

    def test_sorted_descending(self):
        profile = make_profile()
        results = self.engine.recommend(profile, n=5)
        scores = [score for _, score in results]
        assert scores == sorted(scores, reverse=True)

    def test_scores_in_valid_range(self):
        profile = make_profile()
        for _, score in self.engine.recommend(profile, n=5):
            assert 0.0 <= score <= 1.0

    def test_history_excluded_by_default(self):
        profile = make_profile(history=["s1"])
        results = self.engine.recommend(profile, n=5)
        ids = [s.id for s, _ in results]
        assert "s1" not in ids

    def test_history_included_when_flag_false(self):
        profile = make_profile(history=["s1"])
        results = self.engine.recommend(profile, n=5, exclude_history=False)
        ids = [s.id for s, _ in results]
        assert "s1" in ids

    def test_pop_lover_gets_pop_first(self):
        profile = make_profile(
            preferred_genres={"pop": 1.0},
            preferred_moods={"happy": 1.0},
            energy_preference=0.7,
        )
        results = self.engine.recommend(profile, n=5)
        top_genre = results[0][0].genre
        assert top_genre == "pop"


# ---------------------------------------------------------------------------
# explain()
# ---------------------------------------------------------------------------

class TestExplain:
    def setup_method(self):
        self.engine = MusicRecommender(SMALL_CATALOG)

    def test_explain_keys_present(self):
        profile = make_profile()
        song, _ = self.engine.recommend(profile, n=1)[0]
        expl = self.engine.explain(song, profile)
        for key in ("song_id", "title", "total_score",
                    "raw_component_scores", "weighted_contributions",
                    "feature_weights_used"):
            assert key in expl

    def test_explain_total_score_matches_recommend(self):
        profile = make_profile()
        song, score = self.engine.recommend(profile, n=1)[0]
        expl = self.engine.explain(song, profile)
        assert expl["total_score"] == pytest.approx(score, abs=1e-4)

    def test_explain_contributions_sum_to_total(self):
        profile = make_profile()
        song, _ = self.engine.recommend(profile, n=1)[0]
        expl = self.engine.explain(song, profile)
        total = sum(expl["weighted_contributions"].values())
        assert total == pytest.approx(expl["total_score"], abs=1e-4)


# ---------------------------------------------------------------------------
# Bias diagnostics
# ---------------------------------------------------------------------------

class TestBiasDiagnostics:
    def setup_method(self):
        self.engine = MusicRecommender(SMALL_CATALOG)

    def test_genre_distribution_counts_all_songs(self):
        dist = self.engine.genre_distribution()
        assert sum(dist.values()) == len(SMALL_CATALOG)

    def test_filter_bubble_report_structure(self):
        profile = make_profile()
        report  = self.engine.filter_bubble_report(profile, n=5)
        for key in ("top_n", "unique_genres_in_recommendations",
                    "total_genres_in_catalog", "genre_coverage_pct",
                    "filter_bubble_risk"):
            assert key in report

    def test_filter_bubble_risk_value(self):
        profile = make_profile()
        report  = self.engine.filter_bubble_report(profile, n=5)
        assert report["filter_bubble_risk"] in ("LOW", "MEDIUM", "HIGH")

    def test_popularity_bias_report_structure(self):
        profile = make_profile()
        report  = self.engine.popularity_bias_report(profile, n=3)
        assert "rank_changes" in report
        assert "original_popularity_weight" in report

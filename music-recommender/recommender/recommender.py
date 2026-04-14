"""
MusicRecommender — the main recommendation engine.

Usage
-----
    from recommender import MusicRecommender, Song, UserProfile

    engine = MusicRecommender(catalog)
    results = engine.recommend(profile, n=5)
    for song, score in results:
        print(song.title, round(score, 3))
        print(engine.explain(song, profile))
"""

from __future__ import annotations

from typing import Dict, List, Tuple

from .models import Song, UserProfile
from .scorer import compute_score, compute_feature_scores


# ---------------------------------------------------------------------------
# MusicRecommender
# ---------------------------------------------------------------------------

class MusicRecommender:
    """Content-based music recommender.

    Parameters
    ----------
    catalog : list[Song]
        The full library of available songs.
    """

    def __init__(self, catalog: List[Song]) -> None:
        if not catalog:
            raise ValueError("Catalog must contain at least one song.")
        self.catalog: List[Song] = catalog

    # ------------------------------------------------------------------
    # Core recommendation
    # ------------------------------------------------------------------

    def recommend(
        self,
        profile: UserProfile,
        n: int = 10,
        exclude_history: bool = True,
    ) -> List[Tuple[Song, float]]:
        """Return the top-*n* songs ranked by weighted score.

        Parameters
        ----------
        profile         : User taste profile.
        n               : Number of recommendations to return.
        exclude_history : If True, songs already in the user's listening
                          history are excluded from results.

        Returns
        -------
        list of (Song, score) tuples, sorted by score descending.
        """
        history_set = set(profile.listening_history) if exclude_history else set()

        scored: List[Tuple[Song, float]] = []
        for song in self.catalog:
            if song.id in history_set:
                continue
            score = compute_score(song, profile)
            scored.append((song, score))

        scored.sort(key=lambda x: x[1], reverse=True)
        return scored[:n]

    # ------------------------------------------------------------------
    # Explanation / transparency
    # ------------------------------------------------------------------

    def explain(self, song: Song, profile: UserProfile) -> Dict:
        """Return a human-readable breakdown of why a song was scored.

        Returns
        -------
        dict with keys:
            song_id, title, artist, total_score,
            components (per-feature weighted contributions),
            feature_weights (the profile's weights used)
        """
        components = compute_feature_scores(song, profile)
        weights = profile.feature_weights
        total_weight = sum(weights.get(f, 0.0) for f in components)

        weighted_contributions = {
            feature: round(weights.get(feature, 0.0) * score / total_weight, 4)
            for feature, score in components.items()
        }
        raw_scores = {k: round(v, 4) for k, v in components.items()}
        total = sum(weighted_contributions.values())

        return {
            "song_id":           song.id,
            "title":             song.title,
            "artist":            song.artist,
            "genre":             song.genre,
            "mood":              song.mood,
            "total_score":       round(total, 4),
            "raw_component_scores":        raw_scores,
            "weighted_contributions":      weighted_contributions,
            "feature_weights_used":        {k: round(v, 4) for k, v in weights.items()},
        }

    # ------------------------------------------------------------------
    # Bias diagnostics
    # ------------------------------------------------------------------

    def genre_distribution(self) -> Dict[str, int]:
        """Count songs per genre in the catalog (helps spot over-representation)."""
        dist: Dict[str, int] = {}
        for song in self.catalog:
            dist[song.genre] = dist.get(song.genre, 0) + 1
        return dict(sorted(dist.items(), key=lambda x: x[1], reverse=True))

    def popularity_bias_report(
        self, profile: UserProfile, n: int = 10
    ) -> Dict:
        """Compare top-N recommendations with and without popularity weighting.

        Highlights whether setting popularity weight to 0 changes the list,
        which reveals how much the popularity signal influences results.
        """
        # Recommendations with current (potentially popularity-weighted) profile
        with_pop = self.recommend(profile, n=n)

        # Temporarily zero out popularity weight
        modified_weights = dict(profile.feature_weights)
        original_pop_weight = modified_weights.pop("popularity", 0.0)
        modified_weights["popularity"] = 0.0

        no_pop_profile = UserProfile(
            user_id=profile.user_id,
            name=profile.name,
            preferred_genres=profile.preferred_genres,
            preferred_moods=profile.preferred_moods,
            energy_preference=profile.energy_preference,
            feature_weights=modified_weights,
            listening_history=profile.listening_history,
        )
        without_pop = self.recommend(no_pop_profile, n=n)

        ids_with = [s.id for s, _ in with_pop]
        ids_without = [s.id for s, _ in without_pop]
        rank_changes = [
            {
                "song_id": sid,
                "title":   next(s.title for s, _ in with_pop if s.id == sid),
                "rank_with_popularity":    ids_with.index(sid) + 1,
                "rank_without_popularity": ids_without.index(sid) + 1
                if sid in ids_without else "dropped out",
            }
            for sid in ids_with
        ]

        return {
            "original_popularity_weight": original_pop_weight,
            "rank_changes": rank_changes,
            "songs_dropped_when_popularity_removed": [
                sid for sid in ids_with if sid not in ids_without
            ],
            "new_songs_without_popularity": [
                sid for sid in ids_without if sid not in ids_with
            ],
        }

    def filter_bubble_report(
        self, profile: UserProfile, n: int = 10
    ) -> Dict:
        """Measure genre/mood diversity of the top-N recommendations.

        A severe filter bubble means the recommendations contain only 1–2
        genres, even if the catalog is diverse.
        """
        top_n = self.recommend(profile, n=n)
        genre_counts: Dict[str, int] = {}
        mood_counts: Dict[str, int] = {}
        for song, _ in top_n:
            genre_counts[song.genre] = genre_counts.get(song.genre, 0) + 1
            mood_counts[song.mood]   = mood_counts.get(song.mood,  0) + 1

        unique_genres = len(genre_counts)
        unique_moods  = len(mood_counts)
        catalog_genres = len(self.genre_distribution())

        return {
            "top_n": n,
            "unique_genres_in_recommendations": unique_genres,
            "total_genres_in_catalog":          catalog_genres,
            "genre_coverage_pct":               round(unique_genres / catalog_genres * 100, 1),
            "genre_distribution":               dict(sorted(genre_counts.items(), key=lambda x: x[1], reverse=True)),
            "mood_distribution":                dict(sorted(mood_counts.items(), key=lambda x: x[1], reverse=True)),
            "filter_bubble_risk":               "HIGH" if unique_genres <= 2 else ("MEDIUM" if unique_genres <= 4 else "LOW"),
        }

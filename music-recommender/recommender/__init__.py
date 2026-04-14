"""
Music Recommender Package
A content-based filtering system that scores and ranks songs
against a user taste profile using weighted feature matching.
"""

from .models import Song, UserProfile
from .recommender import MusicRecommender

__all__ = ["Song", "UserProfile", "MusicRecommender"]

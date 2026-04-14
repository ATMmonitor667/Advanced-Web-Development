"""
Data models for the Music Recommender system.

Song       — a single track in the catalog.
UserProfile — a listener's taste encoded as weighted feature preferences.
"""

from dataclasses import dataclass, field
from typing import Dict, List


# ---------------------------------------------------------------------------
# Supported vocabulary (used for validation in tests and the UI layer)
# ---------------------------------------------------------------------------

VALID_GENRES = {
    "pop", "rock", "hip-hop", "r&b", "jazz", "classical",
    "electronic", "country", "metal", "blues", "reggae", "folk",
}

VALID_MOODS = {
    "happy", "sad", "energetic", "calm", "romantic",
    "angry", "melancholic", "uplifting", "dark", "nostalgic",
}


# ---------------------------------------------------------------------------
# Song
# ---------------------------------------------------------------------------

@dataclass
class Song:
    """A single track in the music catalog.

    Attributes
    ----------
    id          : Unique identifier (e.g. "s001").
    title       : Track title.
    artist      : Artist or band name.
    genre       : Primary genre (must be in VALID_GENRES).
    mood        : Dominant emotional mood (must be in VALID_MOODS).
    energy      : Normalised energy level in [0.0, 1.0].
                  0 = very mellow, 1 = extremely intense.
    tempo       : Beats per minute (BPM).
    popularity  : Platform popularity score in [0.0, 1.0].
    tags        : Optional free-form descriptor tags.
    """

    id: str
    title: str
    artist: str
    genre: str
    mood: str
    energy: float        # 0.0 – 1.0
    tempo: int           # BPM
    popularity: float    # 0.0 – 1.0
    tags: List[str] = field(default_factory=list)

    def __post_init__(self) -> None:
        if not (0.0 <= self.energy <= 1.0):
            raise ValueError(f"Song '{self.id}': energy must be in [0, 1], got {self.energy}")
        if not (0.0 <= self.popularity <= 1.0):
            raise ValueError(f"Song '{self.id}': popularity must be in [0, 1], got {self.popularity}")

    def __repr__(self) -> str:
        return f"Song(id={self.id!r}, title={self.title!r}, artist={self.artist!r})"


# ---------------------------------------------------------------------------
# UserProfile
# ---------------------------------------------------------------------------

# Default feature importance weights — must sum to 1.0 for clean
# interpretation, but the scorer normalises them automatically.
DEFAULT_FEATURE_WEIGHTS: Dict[str, float] = {
    "genre":      0.40,
    "mood":       0.30,
    "energy":     0.20,
    "popularity": 0.10,
}


@dataclass
class UserProfile:
    """A listener's taste encoded as weighted feature preferences.

    Attributes
    ----------
    user_id            : Unique identifier.
    name               : Display name.
    preferred_genres   : Mapping of genre -> preference strength [0, 1].
                         Higher means the user loves that genre more.
    preferred_moods    : Mapping of mood  -> preference strength [0, 1].
    energy_preference  : Ideal energy level [0.0, 1.0].
    feature_weights    : Importance of each feature in the final score.
                         Keys must match DEFAULT_FEATURE_WEIGHTS.
    listening_history  : Song IDs the user has already heard (excluded from
                         recommendations by default).
    """

    user_id: str
    name: str
    preferred_genres: Dict[str, float]
    preferred_moods: Dict[str, float]
    energy_preference: float
    feature_weights: Dict[str, float] = field(
        default_factory=lambda: dict(DEFAULT_FEATURE_WEIGHTS)
    )
    listening_history: List[str] = field(default_factory=list)

    def __post_init__(self) -> None:
        if not (0.0 <= self.energy_preference <= 1.0):
            raise ValueError(
                f"UserProfile '{self.user_id}': energy_preference must be in [0, 1]"
            )
        for g, w in self.preferred_genres.items():
            if not (0.0 <= w <= 1.0):
                raise ValueError(
                    f"UserProfile '{self.user_id}': genre weight for '{g}' must be in [0, 1]"
                )
        for m, w in self.preferred_moods.items():
            if not (0.0 <= w <= 1.0):
                raise ValueError(
                    f"UserProfile '{self.user_id}': mood weight for '{m}' must be in [0, 1]"
                )

    def __repr__(self) -> str:
        return f"UserProfile(user_id={self.user_id!r}, name={self.name!r})"

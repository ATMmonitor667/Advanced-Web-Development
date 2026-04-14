"""
Song catalog — 40 tracks spanning 12 genres and 10 moods.

Designed to be diverse enough to expose filter-bubble effects when a user
has strong single-genre preferences.
"""

from recommender.models import Song

SONGS: list[Song] = [
    # ── POP ──────────────────────────────────────────────────────────────────
    Song("s001", "Blinding Lights",       "The Weeknd",       "pop",        "energetic",   0.73, 171, 0.97),
    Song("s002", "As It Was",             "Harry Styles",     "pop",        "melancholic", 0.60, 174, 0.95),
    Song("s003", "Levitating",            "Dua Lipa",         "pop",        "happy",       0.83, 103, 0.93),
    Song("s004", "Anti-Hero",             "Taylor Swift",     "pop",        "melancholic", 0.56, 97,  0.96),
    Song("s005", "Flowers",               "Miley Cyrus",      "pop",        "uplifting",   0.68, 118, 0.91),

    # ── ROCK ─────────────────────────────────────────────────────────────────
    Song("s006", "Mr. Brightside",        "The Killers",      "rock",       "energetic",   0.82, 148, 0.88),
    Song("s007", "Somebody That I Used to Know", "Gotye",     "rock",       "sad",         0.52, 129, 0.87),
    Song("s008", "Seven Nation Army",     "The White Stripes","rock",       "angry",       0.70, 124, 0.85),
    Song("s009", "Bohemian Rhapsody",     "Queen",            "rock",       "melancholic", 0.63, 72,  0.96),
    Song("s010", "Wonderwall",            "Oasis",            "rock",       "nostalgic",   0.50, 87,  0.89),

    # ── HIP-HOP ──────────────────────────────────────────────────────────────
    Song("s011", "HUMBLE.",               "Kendrick Lamar",   "hip-hop",    "energetic",   0.77, 150, 0.92),
    Song("s012", "God's Plan",            "Drake",            "hip-hop",    "calm",        0.55, 77,  0.95),
    Song("s013", "Sicko Mode",            "Travis Scott",     "hip-hop",    "dark",        0.80, 155, 0.90),
    Song("s014", "Numb/Encore",           "Jay-Z & Linkin Park","hip-hop",  "angry",       0.78, 120, 0.82),
    Song("s015", "Old Town Road",         "Lil Nas X",        "hip-hop",    "happy",       0.65, 136, 0.94),

    # ── R&B ──────────────────────────────────────────────────────────────────
    Song("s016", "No One",                "Alicia Keys",      "r&b",        "romantic",    0.42, 82,  0.86),
    Song("s017", "Crazy in Love",         "Beyoncé",          "r&b",        "energetic",   0.79, 100, 0.93),
    Song("s018", "Earned It",             "The Weeknd",       "r&b",        "romantic",    0.44, 80,  0.88),
    Song("s019", "Stay With Me",          "Sam Smith",        "r&b",        "sad",         0.38, 88,  0.90),
    Song("s020", "Golden",                "Jill Scott",       "r&b",        "uplifting",   0.48, 94,  0.71),

    # ── JAZZ ─────────────────────────────────────────────────────────────────
    Song("s021", "So What",               "Miles Davis",      "jazz",       "calm",        0.30, 138, 0.80),
    Song("s022", "Take Five",             "Dave Brubeck",     "jazz",       "calm",        0.28, 172, 0.82),
    Song("s023", "Autumn Leaves",         "Bill Evans",       "jazz",       "melancholic", 0.25, 120, 0.78),
    Song("s024", "Fly Me to the Moon",    "Frank Sinatra",    "jazz",       "romantic",    0.35, 132, 0.88),
    Song("s025", "Round Midnight",        "Thelonious Monk",  "jazz",       "dark",        0.27, 66,  0.74),

    # ── CLASSICAL ────────────────────────────────────────────────────────────
    Song("s026", "Clair de Lune",         "Debussy",          "classical",  "calm",        0.15, 72,  0.84),
    Song("s027", "Canon in D",            "Pachelbel",        "classical",  "uplifting",   0.20, 100, 0.79),
    Song("s028", "Moonlight Sonata",      "Beethoven",        "classical",  "melancholic", 0.18, 58,  0.88),
    Song("s029", "The Four Seasons",      "Vivaldi",          "classical",  "energetic",   0.55, 132, 0.82),
    Song("s030", "Gymnopédie No. 1",      "Erik Satie",       "classical",  "nostalgic",   0.12, 76,  0.76),

    # ── ELECTRONIC ───────────────────────────────────────────────────────────
    Song("s031", "Levels",                "Avicii",           "electronic", "uplifting",   0.88, 128, 0.91),
    Song("s032", "One More Time",         "Daft Punk",        "electronic", "happy",       0.85, 123, 0.89),
    Song("s033", "Midnight City",         "M83",              "electronic", "nostalgic",   0.65, 104, 0.84),
    Song("s034", "Strobe",                "deadmau5",         "electronic", "calm",        0.62, 128, 0.80),
    Song("s035", "Animals",               "Martin Garrix",    "electronic", "energetic",   0.92, 128, 0.87),

    # ── COUNTRY ──────────────────────────────────────────────────────────────
    Song("s036", "Jolene",                "Dolly Parton",     "country",    "sad",         0.45, 96,  0.83),
    Song("s037", "Friends in Low Places", "Garth Brooks",     "country",    "happy",       0.60, 100, 0.80),

    # ── BLUES ────────────────────────────────────────────────────────────────
    Song("s038", "The Thrill Is Gone",    "B.B. King",        "blues",      "sad",         0.35, 60,  0.77),

    # ── REGGAE ───────────────────────────────────────────────────────────────
    Song("s039", "No Woman No Cry",       "Bob Marley",       "reggae",     "calm",        0.40, 75,  0.85),

    # ── FOLK ─────────────────────────────────────────────────────────────────
    Song("s040", "The Sound of Silence",  "Simon & Garfunkel","folk",       "melancholic", 0.22, 104, 0.83),
]


# ---------------------------------------------------------------------------
# Sample user profiles for simulation
# ---------------------------------------------------------------------------

from recommender.models import UserProfile

SAMPLE_USERS: list[UserProfile] = [
    UserProfile(
        user_id="u001",
        name="Alex (Pop & Electronic fan)",
        preferred_genres={"pop": 1.0, "electronic": 0.8, "r&b": 0.5},
        preferred_moods={"happy": 1.0, "energetic": 0.8, "uplifting": 0.7},
        energy_preference=0.80,
        feature_weights={"genre": 0.40, "mood": 0.30, "energy": 0.20, "popularity": 0.10},
    ),
    UserProfile(
        user_id="u002",
        name="Jordan (Jazz & Blues enthusiast)",
        preferred_genres={"jazz": 1.0, "blues": 0.9, "classical": 0.5},
        preferred_moods={"calm": 1.0, "melancholic": 0.8, "nostalgic": 0.6},
        energy_preference=0.28,
        feature_weights={"genre": 0.45, "mood": 0.35, "energy": 0.15, "popularity": 0.05},
    ),
    UserProfile(
        user_id="u003",
        name="Sam (Hip-Hop head)",
        preferred_genres={"hip-hop": 1.0, "r&b": 0.7, "pop": 0.3},
        preferred_moods={"energetic": 1.0, "dark": 0.8, "angry": 0.6},
        energy_preference=0.78,
        feature_weights={"genre": 0.50, "mood": 0.25, "energy": 0.15, "popularity": 0.10},
    ),
    UserProfile(
        user_id="u004",
        name="Casey (Eclectic listener)",
        preferred_genres={
            "rock": 0.7, "folk": 0.6, "jazz": 0.6, "classical": 0.5, "blues": 0.5
        },
        preferred_moods={"nostalgic": 0.9, "melancholic": 0.8, "calm": 0.7},
        energy_preference=0.38,
        feature_weights={"genre": 0.35, "mood": 0.35, "energy": 0.20, "popularity": 0.10},
    ),
]

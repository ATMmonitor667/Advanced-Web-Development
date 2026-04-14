# Music Recommender Simulation

A modular Python simulation of a content-based music recommendation system,
built to understand how platforms like Spotify or TikTok predict what users
will love next.

---

## Project Goals

- Explain how raw song attributes are transformed into personalised predictions.
- Implement a **weighted-score recommender** that uses genre, mood, energy, and popularity.
- Identify and document **algorithmic bias** (filter bubbles, popularity skew, cold-start).
- Communicate system behaviour through a **Model Card** and a structured **Reflection**.

---

## Project Structure

```
music-recommender/
│
├── main.py                  # Full 5-phase simulation demo
│
├── recommender/             # Core library package
│   ├── __init__.py
│   ├── models.py            # Song and UserProfile dataclasses
│   ├── features.py          # Genre/mood similarity + energy scoring
│   ├── scorer.py            # Weighted composite score
│   └── recommender.py       # MusicRecommender engine + bias tools
│
├── data/
│   ├── __init__.py
│   └── catalog.py           # 40-song catalog + 4 sample user profiles
│
├── tests/
│   ├── test_models.py       # Song / UserProfile validation tests
│   ├── test_scorer.py       # Feature similarity + scoring tests
│   └── test_recommender.py  # Engine integration + bias diagnostic tests
│
├── model_card.md            # Intended use, limitations, and bias analysis
└── reflection.md            # Design decisions and learning outcomes
```

---

## How It Works

### 1. Data Representation

Each song has five attributes:

| Attribute    | Type    | Range / Values |
|---|---|---|
| `genre`      | string  | 12 genres (pop, rock, jazz, …) |
| `mood`       | string  | 10 moods (happy, calm, energetic, …) |
| `energy`     | float   | [0.0, 1.0] — mellow to intense |
| `tempo`      | int     | BPM |
| `popularity` | float   | [0.0, 1.0] |

A `UserProfile` stores:
- `preferred_genres` — dict mapping genre → preference weight [0, 1]
- `preferred_moods`  — dict mapping mood  → preference weight [0, 1]
- `energy_preference` — ideal energy level [0, 1]
- `feature_weights`  — how much each feature influences the final score

### 2. Scoring Formula

```
score(song, user) =
    ( w_genre      * genre_score
    + w_mood       * mood_score
    + w_energy     * energy_score
    + w_popularity * song.popularity
    ) / (w_genre + w_mood + w_energy + w_popularity)
```

All component scores are in [0, 1], so the final score is also in [0, 1].

**genre_score** — uses a hand-crafted similarity graph.  
  `genre_similarity("pop", "r&b") = 0.65` (related),  
  `genre_similarity("pop", "pop") = 1.0` (identical),  
  `genre_similarity("pop", "jazz") = 0.0` (unrelated)

**mood_score** — uses emotional family groupings.  
  Identical moods → 1.0, same family (e.g. happy + uplifting) → 0.55, different families → 0.0

**energy_score** — `1 - |song.energy - user.energy_preference|`

### 3. Recommendation Pipeline

```
catalog songs
    ↓ filter out listening history
    ↓ compute_score(song, profile) for each
    ↓ sort descending
    → top-N recommendations
```

---

## Quick Start

**Requirements:** Python 3.9+ and pytest

```bash
# Clone / navigate to project
cd music-recommender

# Run the full simulation (all 5 phases)
python main.py

# Run all 56 unit tests
python -m pytest tests/ -v
```

---

## Simulation Phases

| Phase | What it shows |
|---|---|
| 1 — Catalog Overview | Genre distribution across 40 songs |
| 2 — Recommendations | Top-5 picks for 4 different user personas |
| 3 — Explanation | Per-feature score breakdown for the top pick |
| 4 — Bias Diagnostics | Filter bubble + popularity reordering reports |
| 5 — Bias Summary | Plain-language description of 5 identified biases |

---

## Sample Output (Phase 2 — Alex, Pop & Electronic fan)

```
  #    Title                    Artist           Genre        Score
  ---- ------------------------ ---------------- ------------ ------
  1    Levitating               Dua Lipa         pop          0.9870
  2    Blinding Lights          The Weeknd       pop          0.9230
  3    One More Time            Daft Punk        electronic   0.8990
  4    Flowers                  Miley Cyrus      pop          0.8770
  5    Animals                  Martin Garrix    electronic   0.8230
```

---

## Identified Biases

| Bias | Risk Level | Description |
|---|---|---|
| Filter Bubble | Medium | Top-10 spans only 36% of available genres |
| Popularity Bias | Low | Popular songs get a small ranking boost |
| Cold Start | High | New users with no profile receive generic results |
| Catalog Imbalance | Medium | Blues/Reggae/Folk have 1–2 songs vs 5 for major genres |
| Static Preferences | Medium | Profile doesn't adapt to context (time, mood shifts) |

Full analysis in [model_card.md](model_card.md).

---

## Key Design Decisions

- **No machine learning**: All weights and similarity values are hand-crafted.
  This makes every decision transparent and auditable.
- **Modular layers**: `features.py` → `scorer.py` → `recommender.py`.
  Each layer can be swapped independently (e.g., replace the similarity graph
  with learned embeddings without touching the recommender logic).
- **Bias tools built in**: `filter_bubble_report()` and `popularity_bias_report()`
  are first-class methods on the engine, not afterthoughts.
- **Explainability**: Every recommendation can be broken into per-feature
  weighted contributions via `explain()`.

---

## Running Tests

```bash
python -m pytest tests/ -v
# 56 passed in 0.12s
```

Test coverage:
- `test_models.py`      — 14 tests (validation, defaults, repr)
- `test_scorer.py`      — 24 tests (similarity functions, component scores, composite score)
- `test_recommender.py` — 18 tests (init, recommend, explain, bias diagnostics)

---

## Files for Submission

- [x] `main.py` — runnable simulation
- [x] `recommender/` — full library implementation
- [x] `tests/` — 56 unit tests (all passing)
- [x] `model_card.md` — intended use, limitations, bias documentation
- [x] `reflection.md` — design decisions and learning outcomes
- [x] `README.md` — this file

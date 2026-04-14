# Reflection — Music Recommender Simulation

---

## 1. What did you build, and how does it work?

I built a **content-based music recommender** in Python that simulates how
platforms like Spotify or TikTok decide what a listener might enjoy next.

The system works in three stages:

**Stage 1 — Represent songs as feature vectors.**  
Each song in the 40-track catalog is described by five attributes: genre,
mood, energy (0–1), tempo (BPM), and popularity (0–1). These act as the
"ingredients" the recommender can reason about.

**Stage 2 — Encode user taste as a weighted preference profile.**  
A `UserProfile` stores how strongly a user prefers each genre and mood, what
energy level they like, and how much they want each feature to influence their
results. For example, Alex weights genre at 40% and popularity at only 10%,
meaning genre match drives her recommendations far more than how famous a song
is.

**Stage 3 — Score and rank.**  
For every song the user has not already heard, the engine computes four
component scores (genre similarity, mood similarity, energy proximity,
popularity). These are multiplied by the profile's feature weights, summed,
and divided by the total weight to get a final relevance score in [0, 1].
Songs are sorted by score and the top-N are returned.

The `explain()` method breaks the final score into its per-feature
contributions so every recommendation is transparent and auditable.

---

## 2. What transformation happens between input data and output recommendations?

**Input:** raw song attributes (strings and floats) + user preference weights.

**Transformation 1 — Similarity lookup.**  
Genre and mood strings are converted to scalar similarity scores [0, 1] using
hand-crafted similarity graphs. For example, `genre_similarity("pop", "r&b")`
returns 0.65 because pop and R&B share production styles and audience
demographics. Without this step, the model would treat every non-matching
genre as equally irrelevant (0), which would be too coarse.

**Transformation 2 — Preference weighting.**  
Each similarity score is multiplied by the user's preference strength for
that feature. A user who loves Jazz (weight 1.0) will give more credit to
a Jazz song than a user who only mildly tolerates it (weight 0.3).

**Transformation 3 — Weighted aggregation.**  
The four feature scores are blended using the user's importance weights.
This transforms a four-dimensional feature vector into a single scalar that
can be used to rank all songs on the same scale.

**Output:** an ordered list of (Song, score) pairs — personalised
predictions about relevance.

The key insight is that **the same song can score very differently for two
users** purely because their preference weights differ, even before any
similarity difference plays a role.

---

## 3. What did you learn about how real systems (Spotify, TikTok) might work?

This project made three real-world mechanisms tangible:

**a) Features are proxies, not reality.**  
My system uses four explicit features. Real systems use hundreds: audio
waveform embeddings, lyric sentiment, social graph signals, time-of-day,
sequential listening context, and more. The more features, the more
precisely the model can capture taste—but also the more data it needs and
the more opaque it becomes.

**b) Collaborative filtering fixes the filter bubble that content-based
filtering creates.**  
My system only knows what a user says they like. It can never surface a
Jazz song for an Alex who has only ever listed Pop preferences, even if
millions of other Pop fans also love that Jazz track. Real platforms blend
content signals with "users like you also enjoyed…" signals to break out
of the echo chamber.

**c) Popularity is a double-edged feature.**  
Including popularity as a scoring feature helps new users (the cold-start
problem is partially mitigated) and acts as a tie-breaker, but it also
systematically disadvantages niche music and newly-released tracks. Platforms
constantly tune this trade-off.

---

## 4. What algorithmic biases did you find?

Running the built-in bias diagnostics surfaced several issues:

**Filter bubble (MEDIUM risk for all four test users).**  
Every user's top-10 recommendations span only 4 of 11 available catalog
genres (36% genre coverage). Alex's top-10 contains nothing from Classical,
Jazz, Blues, Country, Folk, or Reggae—even though some of those tracks
have high popularity and moderate energy matches. The system is too
confident that genre mismatch is disqualifying.

**Popularity reordering.**  
When I zeroed out the popularity weight for Alex, two songs swapped positions
at ranks 9 and 10. The effect is small with a 0.10 weight, but it would grow
as the catalog expands and more songs cluster near the same feature-based score.

**Catalog representation bias.**  
Seven genres (Blues, Country, Reggae, Folk, Metal) have only 1–2 songs each
versus 5 for Pop, Rock, Hip-Hop, etc. Jordan (Jazz/Blues enthusiast) gets
excellent Jazz recommendations but only one Blues song in the top 10—not
because the model dislikes Blues, but because the catalog offers so few
Blues candidates. The bias is in the data, not the algorithm, but the effect
is indistinguishable from the user's perspective.

**Cold-start vulnerability.**  
I created a minimal profile with all weights set to 0.5 and tested it.
The results were almost entirely determined by the popularity field—essentially
a "charts" recommendation rather than a personalised one. A new user's first
session is the most important for retention, yet this is exactly when the
model is most generic.

---

## 5. What would you do differently or add next?

**Technically:**
- Replace hand-crafted genre/mood similarity graphs with learned embeddings.
  The current graphs are my subjective opinion that "jazz and blues are 80%
  similar." A model trained on actual listening co-occurrence would be
  more accurate and less biased by my assumptions.
- Add a diversity post-processing step: after ranking, enforce that the
  top-10 includes at least 3 distinct genres, then fill remaining slots
  from the ranked list. This directly addresses the filter bubble without
  changing the core scoring logic.
- Build an implicit feedback loop: track which recommended songs the user
  actually plays, skips, or replays, and adjust profile weights accordingly.

**For the bias problem specifically:**
- I would expose the `filter_bubble_report()` output to users as a
  "Your taste bubble" dashboard so they can choose to widen their preferences.
- Separate "exploit" recommendations (high-confidence matches) from
  "explore" recommendations (diverse, lower-score but high-potential picks)
  and present them in distinct UI sections.

**For the model card:**
- The genre and mood similarity values I assigned are educated guesses.
  In a real deployment I would conduct a user study to validate them—for
  example, asking 100 listeners whether they agree that "pop and R&B are
  65% similar" and iterating until the values reflect real-world perception.

---

## 6. How does this project connect to real-world data science?

| Concept from this project | Real-world equivalent |
|---|---|
| `UserProfile.feature_weights` | Model hyperparameters (learned via gradient descent in ML systems) |
| `genre_similarity` graph | Knowledge graph or embedding space |
| `compute_score()` | Inference / prediction step |
| `filter_bubble_report()` | Fairness and diversity audit |
| `model_card.md` | Standard ML documentation practice (used at Google, Hugging Face, etc.) |
| Unit tests checking score ranges | Regression tests for ML pipelines |

The biggest gap between this simulation and production is **learning from
data**. Every number I hardcoded (similarity values, default weights) would
be automatically optimised in a real system using user interaction data.
But the *structure*—feature extraction, scoring, ranking, bias auditing—is
architecturally the same.

# Model Card — Weighted Content-Based Music Recommender

> This document follows the Model Cards for Model Reporting framework
> (Mitchell et al., 2019) adapted for an educational recommender system.

---

## 1. Model Details

| Field | Value |
|---|---|
| **Model name** | Weighted Content-Based Music Recommender |
| **Version** | 1.0 |
| **Type** | Rule-based weighted scoring (content-based filtering) |
| **Authors** | Music Platform Engineering Team |
| **Date** | 2026-04-14 |
| **License** | MIT |
| **Contact** | See README |

### How it works (one paragraph)

For each song in the catalog, the model computes four feature scores
(genre similarity, mood similarity, energy proximity, and popularity) against
a user's stored taste profile. Each score is a number in [0, 1]. The four
scores are multiplied by the user's per-feature importance weights, summed,
and divided by the total weight to produce a final relevance score in [0, 1].
Songs are then sorted by score and the top-N are returned as recommendations.
No machine learning, no user–user collaborative filtering, and no neural
embeddings are used.

---

## 2. Intended Use

### Primary intended use
Personalised song recommendations for a single authenticated listener on a
small-to-medium streaming platform where user tastes are explicitly encoded
as preference profiles (genre weights, mood weights, energy preference).

### Intended users
- End users who have completed a taste-profile questionnaire during onboarding.
- Product teams evaluating content-based filtering before investing in a
  full collaborative-filtering or deep-learning approach.

### Out-of-scope uses
| Use case | Reason out of scope |
|---|---|
| Cold-start recommendations (new users with no profile) | Model requires explicit preference weights; defaults produce near-random rankings |
| Playlist sequencing (ordering, not just selection) | The model ranks songs independently; transitions between songs are not modelled |
| Cross-user recommendations ("users like you also liked…") | Purely content-based; no user–user similarity is computed |
| Real-time mood detection | Mood must be entered by the user; the model cannot infer it from behaviour |
| Non-music media (podcasts, audiobooks) | Feature schema is music-specific |

---

## 3. Training Data

This model does **not** involve machine learning training. The feature weights
and genre/mood similarity graphs were defined manually by the engineering team
based on domain knowledge.

### Catalog data
- **Size**: 40 songs (simulation dataset)
- **Genre coverage**: 12 genres (pop, rock, hip-hop, r&b, jazz, classical,
  electronic, country, metal, blues, reggae, folk)
- **Mood coverage**: 10 moods (happy, sad, energetic, calm, romantic, angry,
  melancholic, uplifting, dark, nostalgic)
- **Known gaps**: Country (2 songs), Blues (1), Reggae (1), Folk (1) are
  heavily under-represented relative to the 5-song genres.

### User profile data
- User profiles are entered manually or via an onboarding questionnaire.
- No user data is collected from external sources.
- Listening history is used only to filter already-heard songs.

---

## 4. Evaluation

### Quantitative metrics

Because the model does not learn from data, classic ML metrics (RMSE,
precision@K) require a labelled held-out set. In this simulation, the
following observable properties were verified:

| Property | Result |
|---|---|
| All scores in [0, 1] | Confirmed by unit tests (56/56 pass) |
| Better-matched songs score higher | Confirmed (`test_better_match_scores_higher`) |
| Score decomposition sums to total | Confirmed (`test_explain_contributions_sum_to_total`) |
| History exclusion works | Confirmed (`test_history_excluded_by_default`) |

### Qualitative evaluation

| User archetype | Top recommendation | Plausibility |
|---|---|---|
| Pop & Electronic fan (Alex) | "Levitating" — Dua Lipa | High: genre + mood + energy all match |
| Jazz & Blues enthusiast (Jordan) | "Take Five" — Dave Brubeck | High: quintessential jazz, calm mood |
| Hip-Hop head (Sam) | "HUMBLE." — Kendrick Lamar | High: energetic, dark hip-hop |
| Eclectic listener (Casey) | "Wonderwall" — Oasis | Plausible: rock/nostalgic matches stated prefs |

---

## 5. Ethical Considerations and Algorithmic Bias

### 5.1 Filter Bubble / Echo Chamber

**What it is**: Because the model scores songs purely by similarity to the
user's current taste profile, it consistently favours familiar-sounding
music. A Pop listener's top-10 will be 70–80% Pop/Electronic/R&B, even
though the catalog has 11 genres.

**Evidence**: The `filter_bubble_report()` method shows that every user's
top-10 spans only 4 of the 11 available genres (36% coverage), indicating a
MEDIUM filter-bubble risk across all profiles.

**Real-world impact**: Users may never discover genres they would enjoy,
limiting cultural exposure and reinforcing existing habits. Platforms
using pure content-based filtering have been criticised for reducing the
diversity of music listeners consume over time.

**Possible mitigations**:
- Periodically inject diversity candidates (songs from under-represented
  genres) into the recommendation list.
- Add an "exploration mode" that temporarily lowers genre weights.
- Use collaborative filtering to surface songs enjoyed by listeners with
  similar—but not identical—taste profiles.

---

### 5.2 Popularity Bias

**What it is**: The model includes a `popularity` feature with a default
weight of 0.10. Songs with high platform popularity receive a small scoring
bonus regardless of content relevance.

**Evidence**: The popularity bias report shows that when popularity weight is
set to 0, two songs swap positions in the bottom two ranks of the top-10
(s011 ↔ s020), confirming a mild reordering effect.

**Real-world impact**: Niche or newly-released music—even when an excellent
content match—may be ranked below well-known songs. This reinforces a
"rich get richer" dynamic where popular songs accumulate even more
listens.

**Possible mitigations**:
- Remove the popularity feature from the scoring formula entirely, or
  replace it with a recency/novelty signal.
- Only use popularity as a cold-start tie-breaker when other scores are
  equal.

---

### 5.3 Cold-Start Problem

**What it is**: New users without a completed profile or listening history
have uniform preference weights (all genres and moods equally likely). In
this state, all feature-based scores converge toward an average, and the
popularity term becomes the dominant ranking signal.

**Real-world impact**: New users receive generic, popularity-driven
recommendations instead of personalised ones. This can cause churn if the
first experience feels irrelevant.

**Possible mitigations**:
- Onboarding questionnaire (already the assumed input source).
- Offer explicit genre/mood seeding: "Pick 3 artists you love."
- Use implicit signals (skips, replays) to bootstrap the profile quickly.

---

### 5.4 Catalog Representation Bias

**What it is**: The song catalog contains 5× more Pop, Rock, Hip-Hop, R&B,
Jazz, Classical, and Electronic songs than Blues (1), Reggae (1), Folk (1),
and Country (2).

**Real-world impact**: Even a user who explicitly prefers Blues or Folk has
fewer candidate songs, so the top-N will inevitably contain cross-genre
spillovers that are lower-quality matches. The system appears to "not
support" certain genres even when the user clearly wants them.

**Possible mitigations**:
- Expand catalog coverage for under-represented genres.
- Apply genre-level normalisation: ensure each genre can contribute at
  least K candidates to the recommendation pool before global ranking.

---

### 5.5 Static Preference Assumption

**What it is**: The `UserProfile` stores fixed weights. The model cannot
detect that a user who usually loves high-energy Electronic might want
calm Classical at 11pm, or that a Hip-Hop fan might want Blues when
feeling sad.

**Possible mitigations**:
- Add context signals (time of day, session activity) to dynamically
  adjust energy preference.
- Allow users to select a "mode" (Focus, Party, Chill) that temporarily
  overrides their default weights.

---

## 6. Limitations Summary

| Limitation | Severity | Notes |
|---|---|---|
| Filter bubble | Medium | 36% genre coverage in top-10 |
| Popularity bias | Low | Small reordering effect only |
| Cold start | High | No profile = near-random recommendations |
| Catalog imbalance | Medium | 7 of 11 genres under-represented |
| Static preferences | Medium | No temporal or contextual adaptation |
| Manual similarity graphs | Medium | Genre/mood similarities are subjective estimates |

---

## 7. Future Improvements

1. **Collaborative filtering layer**: Blend content scores with user–user
   similarity signals to escape the filter bubble.
2. **Implicit feedback loop**: Update preference weights from skip rates,
   replay rates, and listening duration rather than requiring manual input.
3. **Embedding-based similarity**: Replace the hand-crafted genre/mood
   similarity graphs with learned embeddings trained on listening data.
4. **Diversity injection**: Add a post-processing step that ensures the
   final top-N contains at least `D` distinct genres.
5. **Contextual bandits**: Model the recommendation as an exploration–
   exploitation problem so the system actively learns user preferences
   over time.
6. **A/B testing infrastructure**: Evaluate recommendation quality using
   online metrics (click-through rate, listening completion rate, session
   length) rather than offline unit tests alone.

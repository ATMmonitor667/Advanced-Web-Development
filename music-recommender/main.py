"""
Music Recommender Simulation
============================
Entry point for the demo.  Run:

    python main.py

Phases demonstrated
-------------------
1. Show catalog statistics
2. Run recommendations for each sample user
3. Explain the top pick for each user
4. Run bias diagnostics (filter bubble + popularity bias)
"""

import sys
import os

# Make sure the project root is on the path
sys.path.insert(0, os.path.dirname(__file__))

from recommender import MusicRecommender
from data import SONGS, SAMPLE_USERS


# ---------------------------------------------------------------------------
# Formatting helpers
# ---------------------------------------------------------------------------

DIVIDER = "=" * 70
THIN    = "-" * 70


def header(text: str) -> None:
    print(f"\n{DIVIDER}")
    print(f"  {text}")
    print(DIVIDER)


def section(text: str) -> None:
    print(f"\n{THIN}")
    print(f"  {text}")
    print(THIN)


def print_recommendations(results: list, n: int = 5) -> None:
    print(f"  {'#':<4} {'Title':<35} {'Artist':<25} {'Genre':<12} {'Score'}")
    print(f"  {'-'*4} {'-'*35} {'-'*25} {'-'*12} {'-'*6}")
    for rank, (song, score) in enumerate(results[:n], start=1):
        print(
            f"  {rank:<4} {song.title:<35} {song.artist:<25} "
            f"{song.genre:<12} {score:.4f}"
        )


def print_explanation(expl: dict) -> None:
    print(f"\n  Explaining: \"{expl['title']}\" by {expl['artist']}")
    print(f"  Total Score : {expl['total_score']:.4f}")
    print(f"\n  {'Feature':<12} {'Raw Score':>10}  {'Weight':>8}  {'Contribution':>14}")
    print(f"  {'-'*12} {'-'*10}  {'-'*8}  {'-'*14}")
    fw = expl["feature_weights_used"]
    for feat, raw in expl["raw_component_scores"].items():
        contrib = expl["weighted_contributions"][feat]
        weight  = fw.get(feat, 0.0)
        print(f"  {feat:<12} {raw:>10.4f}  {weight:>8.2f}  {contrib:>14.4f}")


# ---------------------------------------------------------------------------
# Phase 1 — Catalog overview
# ---------------------------------------------------------------------------

def phase1_catalog(engine: MusicRecommender) -> None:
    header("PHASE 1 — Catalog Overview")
    print(f"\n  Total songs: {len(engine.catalog)}")
    print("\n  Genre distribution in catalog:")
    for genre, count in engine.genre_distribution().items():
        bar = "#" * count
        print(f"    {genre:<14} {bar} ({count})")


# ---------------------------------------------------------------------------
# Phase 2 — Recommendations per user
# ---------------------------------------------------------------------------

def phase2_recommendations(engine: MusicRecommender) -> None:
    header("PHASE 2 — Personalised Recommendations")
    for profile in SAMPLE_USERS:
        section(f"User: {profile.name}")
        print(f"  Preferred genres : {profile.preferred_genres}")
        print(f"  Preferred moods  : {profile.preferred_moods}")
        print(f"  Energy preference: {profile.energy_preference}")
        results = engine.recommend(profile, n=5)
        print()
        print_recommendations(results, n=5)


# ---------------------------------------------------------------------------
# Phase 3 — Explain top recommendation
# ---------------------------------------------------------------------------

def phase3_explain(engine: MusicRecommender) -> None:
    header("PHASE 3 — Recommendation Explanations (Top Pick per User)")
    for profile in SAMPLE_USERS:
        section(f"User: {profile.name}")
        results = engine.recommend(profile, n=1)
        if results:
            song, _ = results[0]
            expl = engine.explain(song, profile)
            print_explanation(expl)


# ---------------------------------------------------------------------------
# Phase 4 — Bias diagnostics
# ---------------------------------------------------------------------------

def phase4_bias(engine: MusicRecommender) -> None:
    header("PHASE 4 — Bias Diagnostics")

    for profile in SAMPLE_USERS:
        section(f"Filter Bubble Report — {profile.name}")
        report = engine.filter_bubble_report(profile, n=10)
        print(f"  Top-10 recommendations span {report['unique_genres_in_recommendations']} "
              f"of {report['total_genres_in_catalog']} catalog genres "
              f"({report['genre_coverage_pct']}% coverage)")
        print(f"  Filter-bubble risk: {report['filter_bubble_risk']}")
        print(f"  Genre breakdown : {report['genre_distribution']}")
        print(f"  Mood breakdown  : {report['mood_distribution']}")

    print()
    section("Popularity Bias Report — Alex (Pop & Electronic fan)")
    alex = SAMPLE_USERS[0]
    pop_report = engine.popularity_bias_report(alex, n=10)
    print(f"  Original popularity weight: {pop_report['original_popularity_weight']}")
    songs_dropped = pop_report["songs_dropped_when_popularity_removed"]
    songs_gained  = pop_report["new_songs_without_popularity"]
    print(f"  Songs that DROP OUT when popularity weight=0 : {songs_dropped or 'none'}")
    print(f"  New songs that ENTER when popularity weight=0: {songs_gained or 'none'}")
    print()
    print(f"  {'Song ID':<8} {'Title':<35} {'Rank w/ pop':>12} {'Rank w/o pop':>13}")
    print(f"  {'-'*8} {'-'*35} {'-'*12} {'-'*13}")
    for entry in pop_report["rank_changes"]:
        title = next(
            (s.title for s in engine.catalog if s.id == entry["song_id"]), "?"
        )
        print(
            f"  {entry['song_id']:<8} {title:<35} "
            f"{entry['rank_with_popularity']:>12} "
            f"{str(entry['rank_without_popularity']):>13}"
        )


# ---------------------------------------------------------------------------
# Phase 5 — Algorithmic bias summary (printed to console)
# ---------------------------------------------------------------------------

def phase5_bias_summary() -> None:
    header("PHASE 5 — Algorithmic Bias Summary")
    issues = [
        (
            "Filter Bubble",
            "The system only scores songs that resemble the user's stated preferences. "
            "A user who loves Pop will almost exclusively receive Pop/Electronic/R&B, "
            "never being exposed to Jazz or Classical."
        ),
        (
            "Popularity Bias",
            "Songs with high popularity scores receive a small but consistent bonus. "
            "This can push less-popular niche tracks off the top-N list even when they "
            "are a better content match for the user."
        ),
        (
            "Cold-Start Problem",
            "A brand-new user with no listening history or stated preferences gets "
            "essentially random recommendations (all scores gravitate toward the "
            "popularity baseline). The system has no signal to personalise from."
        ),
        (
            "Catalog Representation Bias",
            "The catalog itself contains more Pop/Rock/Hip-Hop tracks than Classical "
            "or Reggae. Even an 'eclectic' user's recommendations will lean toward "
            "over-represented genres because there are simply more candidates."
        ),
        (
            "Static Preference Assumption",
            "UserProfile weights are fixed. Real tastes shift with context (time of "
            "day, mood, season). The system cannot detect or adapt to these shifts."
        ),
    ]
    for title, desc in issues:
        print(f"\n  [{title}]")
        # Word-wrap description at ~65 chars
        words = desc.split()
        line, lines = [], []
        for w in words:
            if sum(len(x) + 1 for x in line) + len(w) > 65:
                lines.append(" ".join(line))
                line = [w]
            else:
                line.append(w)
        if line:
            lines.append(" ".join(line))
        for l in lines:
            print(f"    {l}")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    engine = MusicRecommender(SONGS)

    phase1_catalog(engine)
    phase2_recommendations(engine)
    phase3_explain(engine)
    phase4_bias(engine)
    phase5_bias_summary()

    print(f"\n{DIVIDER}")
    print("  Simulation complete.")
    print(DIVIDER)

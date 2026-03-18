# Number Detective — Game Glitch Investigator

A Python number-guessing game intentionally shipped with bugs by an AI pair programmer.
Your mission: diagnose, explain, and repair the glitches using code review, manual testing, and automated pytest cases.

---

## Project Structure

```
game-glitch-investigator/
├── buggy/              ← AI-generated code with 5 intentional bugs
│   ├── game.py
│   ├── hints.py
│   └── score.py
├── fixed/              ← Corrected versions (one minimal fix per bug)
│   ├── game.py
│   ├── hints.py
│   └── score.py
├── tests/              ← pytest suite (all tests pass against fixed/)
│   ├── test_hints.py
│   ├── test_score.py
│   └── test_game_logic.py
├── BUG_REPORT.md       ← Full diagnosis: what broke, why, and the fix
├── REFLECTION.md       ← Project reflection answers
└── requirements.txt
```

---

## How to Play (fixed version)

```bash
cd game-glitch-investigator
python fixed/game.py
```

- Guess a secret number between **1 and 100**.
- You have **7 attempts**.
- After each wrong guess you receive a directional hint (*Too high / Too low*) and a temperature hint (*Freezing → Burning hot*).
- Your final score rewards fewer guesses. Solve in one guess for a perfect 100 + 50 bonus.

---

## Running the Tests

```bash
# Install pytest
pip install -r requirements.txt

# Run all tests (against fixed/ — should all pass)
pytest tests/ -v

# See which tests FAIL against the buggy code
# Edit the sys.path line in each test file to point to "buggy" instead of "fixed"
pytest tests/ -v
```

Expected output against `fixed/`:

```
tests/test_hints.py::TestDirectionalHint::test_guess_too_high_says_high   PASSED
tests/test_hints.py::TestDirectionalHint::test_hints_are_not_inverted      PASSED
...
tests/test_score.py::TestCalculateScore::test_one_guess_gives_max_score    PASSED
tests/test_score.py::TestCalculateBonus::test_bonus_is_never_none          PASSED
...
========================= 28 passed in 0.XXs =========================
```

---

## The 5 Bugs (spoiler-free titles)

| # | File | Type | Symptom |
|---|------|------|---------|
| 1 | `buggy/game.py` | Logic | Game never ends when player runs out of guesses |
| 2 | `buggy/hints.py` | Logic | Hints always point the player in the wrong direction |
| 3 | `buggy/score.py` | Logic | More guesses gives a higher score (backwards) |
| 4 | `buggy/score.py` | Runtime | Game crashes with TypeError after a long-game win |
| 5 | `buggy/game.py` | Logic | Guessing exactly 1 or 100 is incorrectly rejected |

Full diagnosis with code snippets: see **BUG_REPORT.md**.

---

## Skills Demonstrated

- Identifying **syntax, logic, and runtime** bugs in AI-generated Python code
- Using AI tools **critically** — accepting, modifying, and rejecting suggestions
- Writing **pytest** tests that catch specific bugs and verify fixes
- Applying **minimal, readable fixes** without over-engineering
- Documenting findings in a structured bug report and reflection

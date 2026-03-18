# Reflection — Game Glitch Investigator

## Phase 1: Glitch Hunt

**What bugs did you find, and how?**

I found five bugs across three files:

1. **Infinite loop** (`buggy/game.py`): Found by mentally tracing the loop. The variable `guesses_made` was reset to `0` inside the `while` loop body, so the condition `guesses_made < max_guesses` was always `True`. The game could never end by exhausting guesses.

2. **Inverted hints** (`buggy/hints.py`): Found through a simple test case — guessing a number I knew was too high and seeing the hint say "Too low!" The comparison branches had their return values swapped.

3. **Backwards score formula** (`buggy/score.py`): Found by running the function manually: `calculate_score(1, 7)` returned `14` and `calculate_score(7, 7)` returned `100`. More guesses = higher score, which is the exact opposite of what the docstring described.

4. **TypeError crash** (`buggy/score.py`): Found by testing a game path that used 6 guesses. Python raised `TypeError: unsupported operand type(s) for +: 'int' and 'NoneType'`. The `calculate_bonus` function had no `return` for the `> 5` case and silently returned `None`.

5. **Boundary rejection** (`buggy/game.py`): Found by trying to input `1` and `100` as guesses. Both were rejected despite the game message saying "between 1 and 100 (inclusive)". The guard used strict `<` / `>` instead of `<=` / `>=`.

---

## Phase 2: Investigate and Repair

**What was your fix strategy?**

For each bug I followed the same three-step pattern:
1. Reproduce the bug with a minimal test case.
2. Identify the single line (or missing line) causing the problem.
3. Apply the minimal change needed — no extra refactoring.

I used the AI pair programmer to help draft the pytest tests, but I reviewed every generated test for correctness before accepting it. In two cases I modified AI-suggested tests:
- The AI initially wrote `assert score > 50` for the perfect-guess test. I changed it to `assert score == 100` because the docstring explicitly promised a maximum score for one guess.
- The AI generated a test for `get_grade` that only checked three boundary values. I expanded it to cover all grade transitions using `@pytest.mark.parametrize`.

**When did you accept, modify, or reject AI suggestions?**

| Suggestion | Decision | Reason |
|---|---|---|
| Draft of `fixed/hints.py` | Accepted | Correct swap of return values; minimal change. |
| Draft of `calculate_score` fix | Modified | AI used `(max_guesses - guesses_used) / max_guesses` (off by one — scores 0 for last guess). I added `+ 1`. |
| Refactor `play_game` into smaller functions | Rejected | The task was to fix bugs, not restructure. Extra refactoring risked introducing new bugs. |
| Add `logging` module throughout | Rejected | Over-engineering for a small CLI game; not required by the spec. |

---

## Phase 3: Human Judgment Reflections

**Why can't you just trust AI-generated code?**

The bugs in this project are a perfect case study. Each one looked plausible in isolation:
- Resetting a counter inside a loop *could* be intentional (e.g., a retry count).
- Swapped string literals don't cause a syntax error — Python has no idea what English words mean.
- An inverted formula still returns a number in the expected range.
- A missing `return` is valid Python — the `None` just hides until runtime.

AI code generators optimise for patterns that *look* correct and compile without errors. They don't simulate what the code actually does. Human review — reading, tracing, and testing — is the only reliable way to catch logic and semantic bugs.

**What did this project teach you?**

1. **Read the docstring, then verify the code matches it.** The biggest bugs here (inverted hints, backwards score) were caught instantly by comparing the docstring promise to the implementation.
2. **Test boundary values explicitly.** Off-by-one errors (`<` vs `<=`) are invisible until you test the exact boundary.
3. **Never trust an implicit `None` return.** If a function says it returns an `int`, add an assertion or type hint. Python's silent `None` return is a trap for multi-branch functions.
4. **Minimal fixes are safer than rewrites.** Each fix in this project touched at most one or two lines. Larger changes risk introducing new bugs.

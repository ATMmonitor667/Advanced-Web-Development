# Bug Report — Number Detective

## Summary

The AI pair programmer generated a Python number-guessing game with **5 bugs** across 3 files. All bugs have been diagnosed, explained, and fixed in the `fixed/` directory. Automated tests in `tests/` verify correct behavior.

---

## Bug 1 — Game never ends (infinite loop)

**File:** `buggy/game.py`, line 43
**Type:** Logic bug
**Severity:** Critical

### Description
The variable `guesses_made` is reset to `0` at the top of every loop iteration. Because the loop condition is `while guesses_made < max_guesses`, it is **always True** — the counter resets before it is ever checked. The game can only end by winning; it is impossible to run out of guesses.

### Buggy code
```python
while guesses_made < max_guesses and not game_won:
    guesses_made = 0   # ← resets every iteration!
    ...
    guesses_made += 1
```

### Fix
Remove the reset line from inside the loop.
```python
guesses_made = 0   # ← initialize ONCE before the loop

while guesses_made < max_guesses and not game_won:
    ...
    guesses_made += 1
```

---

## Bug 2 — Hints lie (inverted directions)

**File:** `buggy/hints.py`, lines 11–12
**Type:** Logic bug
**Severity:** Critical

### Description
The return values in `get_directional_hint` are swapped. When the player's guess is **too high**, the game says *"Too low!"* and tells them to guess higher — making it impossible to converge on the correct answer through normal play.

### Buggy code
```python
if guess > secret:
    return "Too low! Try a higher number."   # ← wrong: guess is ABOVE secret
elif guess < secret:
    return "Too high! Try a lower number."   # ← wrong: guess is BELOW secret
```

### Fix
```python
if guess > secret:
    return "Too high! Try a lower number."   # ← correct
elif guess < secret:
    return "Too low! Try a higher number."   # ← correct
```

---

## Bug 3 — Score goes haywire (inverted formula)

**File:** `buggy/score.py`, line 19
**Type:** Logic bug
**Severity:** High

### Description
The scoring formula rewards **more guesses** with a higher score — the opposite of intended behaviour. A player who solves in 7 guesses scores ~100 points while a player who solves in 1 guess scores ~14 points.

### Buggy code
```python
score = (guesses_used / max_guesses) * MAX_SCORE
```

### Fix
```python
score = ((max_guesses - guesses_used + 1) / max_guesses) * MAX_SCORE
```

---

## Bug 4 — Runtime crash (TypeError: NoneType + int)

**File:** `buggy/score.py`, lines 25–31
**Type:** Runtime bug
**Severity:** High

### Description
`calculate_bonus` has no `return` statement for the case where `guesses_used > 5`. Python silently returns `None`. When the caller adds this to `base_score` (`total_score = base_score + bonus`), a `TypeError` is raised and the game crashes on any solve that uses 6 or 7 guesses.

### Buggy code
```python
def calculate_bonus(guesses_used):
    if guesses_used == 1:
        return 50
    elif guesses_used <= 3:
        return 20
    elif guesses_used <= 5:
        return 10
    # ← missing return! falls through as None
```

### Fix
```python
    return 0   # ← explicit return for all other cases
```

---

## Bug 5 — Valid inputs rejected (off-by-one boundary check)

**File:** `buggy/game.py`, line 52
**Type:** Logic bug
**Severity:** Medium

### Description
The input validation uses strict inequalities (`1 < guess < 100`), which **excludes the boundary values 1 and 100**. Both are valid guesses according to the game's stated rules ("a number between 1 and 100").

### Buggy code
```python
if not (1 < guess < 100):
    print("  Please guess a number between 1 and 100 (inclusive).\n")
```

### Fix
```python
if not (1 <= guess <= 100):
    print("  Please guess a number between 1 and 100 (inclusive).\n")
```

---

## Bonus — Proximity hint off-by-one (boundary values skipped)

**File:** `buggy/hints.py`, lines 20–27
**Type:** Logic bug
**Severity:** Low

### Description
All thresholds in `get_proximity_hint` use strict `<` instead of `<=`. A player at exactly distance 5 sees *"Warm."* instead of *"Very warm!"*, and similarly for distances 15 and 30.

### Fix
Change every `distance < N` to `distance <= N` for the three boundary thresholds.

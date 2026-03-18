"""
Number Detective — FIXED main game file.

Fixes applied:
  1. Removed `guesses_made = 0` reset from inside the loop — game now ends correctly.
  2. Changed `1 < guess < 100` to `1 <= guess <= 100` — accepts boundary values 1 and 100.
  3. Bonus crash: calculate_bonus now always returns int (fixed in score.py).
"""

import sys
import os
import random

sys.path.insert(0, os.path.dirname(__file__))

from hints import get_hint
from score import calculate_score, calculate_bonus, get_grade


def play_game():
    """Main game loop for Number Detective."""
    secret_number = random.randint(1, 100)
    max_guesses = 7
    game_won = False

    print("=" * 45)
    print("       WELCOME TO NUMBER DETECTIVE!")
    print("=" * 45)
    print("I've picked a secret number between 1 and 100.")
    print(f"You have {max_guesses} attempts to find it.")
    print("Type 'quit' to exit at any time.\n")

    guesses_made = 0

    while guesses_made < max_guesses and not game_won:
        # FIXED: no longer resetting guesses_made here

        user_input = input(f"Attempt {guesses_made + 1}/{max_guesses}: ").strip()

        if user_input.lower() == "quit":
            print("Thanks for playing! Goodbye!")
            return

        try:
            guess = int(user_input)
        except ValueError:
            print("  Please enter a valid whole number.\n")
            continue

        # FIXED: inclusive bounds — 1 and 100 are valid guesses
        if not (1 <= guess <= 100):
            print("  Please guess a number between 1 and 100 (inclusive).\n")
            continue

        guesses_made += 1

        if guess == secret_number:
            game_won = True
            bonus = calculate_bonus(guesses_made)       # FIXED: always returns int
            base_score = calculate_score(guesses_made, max_guesses)
            total_score = base_score + bonus
            grade = get_grade(total_score)

            print(f"\n{'=' * 45}")
            print(f"  CORRECT! The number was {secret_number}!")
            print(f"  Guesses used: {guesses_made}")
            print(f"  Score: {total_score} ({grade})")
            print(f"{'=' * 45}\n")
        else:
            hint = get_hint(guess, secret_number)
            remaining = max_guesses - guesses_made
            print(f"  {hint}")
            print(f"  Guesses remaining: {remaining}\n")

    if not game_won:
        print(f"\nGame over! The secret number was {secret_number}.")
        print("Better luck next time!\n")


if __name__ == "__main__":
    play_game()

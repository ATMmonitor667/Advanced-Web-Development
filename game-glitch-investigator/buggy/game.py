"""
Number Detective — Main game file.
AI-generated: A number guessing game with hints and scoring.

Known glitches to investigate:
  1. Game never ends when the player runs out of guesses.
  2. Hints point the player in the WRONG direction.
  3. Score goes haywire — more guesses gives higher score.
  4. Runtime crash (TypeError) when player uses more than 5 guesses.
  5. Valid guesses of 1 and 100 are incorrectly rejected.
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
        guesses_made = 0  # GLITCH: resets the counter every iteration!
                          # The loop condition (guesses_made < max_guesses) is
                          # always True, so the game NEVER ends by exhausting guesses.

        user_input = input(f"Attempt {guesses_made + 1}/{max_guesses}: ").strip()

        if user_input.lower() == "quit":
            print("Thanks for playing! Goodbye!")
            return

        try:
            guess = int(user_input)
        except ValueError:
            print("  Please enter a valid whole number.\n")
            continue

        # GLITCH: strict inequalities exclude the valid boundary guesses 1 and 100
        if not (1 < guess < 100):
            print("  Please guess a number between 1 and 100 (inclusive).\n")
            continue

        guesses_made += 1

        if guess == secret_number:
            game_won = True
            bonus = calculate_bonus(guesses_made)       # May return None (see score.py)
            base_score = calculate_score(guesses_made, max_guesses)
            total_score = base_score + bonus            # GLITCH: crashes if bonus is None
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

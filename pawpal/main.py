"""
PawPal+ CLI Demo Script
Exercises all core features: task creation, sorting, filtering,
recurring tasks, conflict detection, and overdue checks.
"""

from datetime import date, timedelta
from pawpal_system import (
    PawPalSystem,
    FeedingTask, WalkTask, MedicationTask, AppointmentTask,
    Frequency, Priority, TaskStatus, TaskType,
)

# ─────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────

def section(title: str) -> None:
    print(f"\n{'=' * 60}")
    print(f"  {title}")
    print(f"{'=' * 60}")


# ─────────────────────────────────────────────
# Setup: Owner and Pets
# ─────────────────────────────────────────────

section("1. Creating Owner and Pets")

system = PawPalSystem("Alex Rivera", email="alex@pawpal.com", phone="555-0100")

buddy = system.add_pet("Buddy",  species="Dog",    breed="Golden Retriever", age=3, weight_kg=30.5)
luna  = system.add_pet("Luna",   species="Cat",    breed="Siamese",          age=5, weight_kg=4.2)
mochi = system.add_pet("Mochi",  species="Rabbit", breed="Holland Lop",      age=2, weight_kg=1.8)

print(system.owner)
for pet in system.owner.pets:
    print(f"  • {pet}")


# ─────────────────────────────────────────────
# Setup: Tasks (intentionally out of order)
# ─────────────────────────────────────────────

section("2. Adding Tasks")

today      = date.today()
tomorrow   = today + timedelta(days=1)
next_week  = today + timedelta(days=7)

# Buddy — multiple task types
system.add_task("Buddy", FeedingTask(
    name="Morning Feed", task_type=TaskType.FEEDING,
    due_date=today, due_time="08:00",
    pet_name="Buddy", owner_name=system.owner.name,
    frequency=Frequency.DAILY, duration_minutes=10,
    food_type="Dry Kibble", amount_grams=300,
))
system.add_task("Buddy", WalkTask(
    name="Evening Walk", task_type=TaskType.WALK,
    due_date=today, due_time="18:00",
    pet_name="Buddy", owner_name=system.owner.name,
    frequency=Frequency.DAILY, duration_minutes=45,
    distance_km=3.0,
))
system.add_task("Buddy", MedicationTask(
    name="Flea Treatment", task_type=TaskType.MEDICATION,
    due_date=today, due_time="09:00",
    pet_name="Buddy", owner_name=system.owner.name,
    frequency=Frequency.MONTHLY, duration_minutes=5,
    medication_name="NexGard", dosage="1 chew",
))
# Conflict: overlaps Evening Walk (18:00 + 45 min)
system.add_task("Buddy", AppointmentTask(
    name="Annual Checkup", task_type=TaskType.APPOINTMENT,
    due_date=today, due_time="18:20",
    pet_name="Buddy", owner_name=system.owner.name,
    frequency=Frequency.ONCE, duration_minutes=60,
    vet_name="Dr. Patel", location="Green Paws Clinic",
))

# Luna
system.add_task("Luna", FeedingTask(
    name="Lunch Feed", task_type=TaskType.FEEDING,
    due_date=today, due_time="12:30",
    pet_name="Luna", owner_name=system.owner.name,
    frequency=Frequency.DAILY, duration_minutes=5,
    food_type="Wet Food", amount_grams=100,
))
system.add_task("Luna", MedicationTask(
    name="Thyroid Medication", task_type=TaskType.MEDICATION,
    due_date=today, due_time="08:30",
    pet_name="Luna", owner_name=system.owner.name,
    frequency=Frequency.DAILY, duration_minutes=5,
    medication_name="Methimazole", dosage="2.5mg",
))

# Mochi — tomorrow
system.add_task("Mochi", FeedingTask(
    name="Morning Pellets", task_type=TaskType.FEEDING,
    due_date=tomorrow, due_time="07:30",
    pet_name="Mochi", owner_name=system.owner.name,
    frequency=Frequency.DAILY, duration_minutes=5,
    food_type="Pellets", amount_grams=50,
))

# Overdue task (yesterday, still pending)
yesterday = today - timedelta(days=1)
system.add_task("Buddy", WalkTask(
    name="Morning Jog (MISSED)", task_type=TaskType.WALK,
    due_date=yesterday, due_time="07:00",
    pet_name="Buddy", owner_name=system.owner.name,
    frequency=Frequency.ONCE, duration_minutes=30,
))

print(f"Total tasks created: {len(system.get_all_tasks())}")


# ─────────────────────────────────────────────
# Today's Schedule — sorted chronologically
# ─────────────────────────────────────────────

section("3. Today's Schedule (Sorted by Time)")
system.scheduler.print_schedule(system.todays_schedule(), "Today's Tasks")


# ─────────────────────────────────────────────
# Priority Sorting
# ─────────────────────────────────────────────

section("4. Today's Tasks Sorted by Priority")
today_tasks = system.owner.get_all_tasks_for_date(today)
priority_sorted = system.scheduler.sort_by_priority(today_tasks)
system.scheduler.print_schedule(priority_sorted, "Tasks — HIGH Priority First")


# ─────────────────────────────────────────────
# Filtering
# ─────────────────────────────────────────────

section("5. Filtering")

all_tasks = system.get_all_tasks()

buddy_tasks = system.scheduler.filter_by_pet(all_tasks, "Buddy")
print(f"Buddy's tasks ({len(buddy_tasks)}):")
for t in system.scheduler.sort_by_time(buddy_tasks):
    print(f"  {t}")

med_tasks = system.scheduler.filter_by_type(all_tasks, TaskType.MEDICATION)
print(f"\nAll Medication tasks ({len(med_tasks)}):")
for t in med_tasks:
    print(f"  {t}")


# ─────────────────────────────────────────────
# Conflict Detection
# ─────────────────────────────────────────────

section("6. Conflict Detection")
conflicts = system.detect_conflicts()
if conflicts:
    print(f"[!] {len(conflicts)} conflict(s) detected:")
    for a, b, reason in conflicts:
        print(f"   -> {reason}")
else:
    print("  No conflicts detected.")


# ─────────────────────────────────────────────
# Overdue Tasks
# ─────────────────────────────────────────────

section("7. Overdue Tasks")
overdue = system.scheduler.get_overdue_tasks()
if overdue:
    print(f"  {len(overdue)} overdue task(s):")
    for t in overdue:
        print(f"  {t}")
else:
    print("  No overdue tasks.")


# ─────────────────────────────────────────────
# Recurring Task Demo
# ─────────────────────────────────────────────

section("8. Recurring Task — Mark Complete & Auto-Schedule Next")
buddy_pet    = system.owner.get_pet("Buddy")
morning_feed = next(
    (t for t in buddy_pet.tasks if t.name == "Morning Feed"), None
)

if morning_feed:
    print(f"Before: {morning_feed}")
    next_task = system.complete_task(morning_feed.task_id)
    print(f"After:  {morning_feed}")
    if next_task[1]:
        print(f"New recurring task created: {next_task[1]}")


# ─────────────────────────────────────────────
# Daily Summary
# ─────────────────────────────────────────────

section("9. Daily Summary")
summary = system.scheduler.daily_summary(today)
print(f"  Date      : {summary['date']}")
print(f"  Total     : {summary['total']}")
print(f"  Pending   : {summary['pending']}")
print(f"  Completed : {summary['completed']}")
print(f"  Conflicts : {summary['conflicts']}")
print(f"  Overdue   : {summary['overdue']}")


# ─────────────────────────────────────────────
# Upcoming 7-Day Schedule
# ─────────────────────────────────────────────

section("10. Upcoming 7-Day Schedule")
upcoming = system.scheduler.upcoming_schedule(days=7)
system.scheduler.print_schedule(upcoming, "Next 7 Days")

print("[DONE] Demo complete!\n")

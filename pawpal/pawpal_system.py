"""
PawPal+ System — Core Logic Layer
Manages Owners, Pets, Tasks, and Scheduling with algorithmic intelligence.
"""

from __future__ import annotations
from dataclasses import dataclass, field
from datetime import date, datetime, timedelta
from enum import Enum
from typing import Optional
import uuid


# ─────────────────────────────────────────────
# Enumerations
# ─────────────────────────────────────────────

class TaskType(Enum):
    FEEDING = "Feeding"
    WALK = "Walk"
    MEDICATION = "Medication"
    APPOINTMENT = "Appointment"


class Frequency(Enum):
    ONCE = "Once"
    DAILY = "Daily"
    WEEKLY = "Weekly"
    MONTHLY = "Monthly"


class Priority(Enum):
    LOW = 1
    MEDIUM = 2
    HIGH = 3


class TaskStatus(Enum):
    PENDING = "Pending"
    COMPLETED = "Completed"
    SKIPPED = "Skipped"


# ─────────────────────────────────────────────
# Task (base dataclass + subclasses)
# ─────────────────────────────────────────────

@dataclass
class Task:
    """Represents a single pet-care activity with scheduling metadata."""
    name: str
    task_type: TaskType
    due_date: date
    due_time: str                       # "HH:MM" 24-hour format
    pet_name: str
    owner_name: str
    frequency: Frequency = Frequency.ONCE
    priority: Priority = Priority.MEDIUM
    duration_minutes: int = 30
    notes: str = ""
    status: TaskStatus = field(default=TaskStatus.PENDING, init=True)
    task_id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])

    # ── Derived helpers ──────────────────────────────────────────────────────

    @property
    def datetime(self) -> datetime:
        """Return a combined datetime object for sorting / conflict checks."""
        h, m = map(int, self.due_time.split(":"))
        return datetime(self.due_date.year, self.due_date.month,
                        self.due_date.day, h, m)

    @property
    def end_datetime(self) -> datetime:
        """Return the estimated end time based on duration."""
        return self.datetime + timedelta(minutes=self.duration_minutes)

    def is_overdue(self) -> bool:
        """Return True if the task is past its due datetime and still pending."""
        return self.status == TaskStatus.PENDING and self.datetime < datetime.now()

    # ── State mutation ───────────────────────────────────────────────────────

    def mark_complete(self) -> Optional["Task"]:
        """
        Mark this task as completed.
        For recurring tasks, return a new Task instance scheduled for the next
        occurrence; otherwise return None.
        """
        self.status = TaskStatus.COMPLETED

        delta_map = {
            Frequency.DAILY: timedelta(days=1),
            Frequency.WEEKLY: timedelta(weeks=1),
            Frequency.MONTHLY: timedelta(days=30),
        }

        if self.frequency in delta_map:
            next_date = self.due_date + delta_map[self.frequency]
            # Create a shallow copy via dataclass replace pattern
            import dataclasses
            next_task = dataclasses.replace(
                self,
                due_date=next_date,
                status=TaskStatus.PENDING,
                task_id=str(uuid.uuid4())[:8],
            )
            return next_task
        return None

    def mark_skipped(self) -> None:
        """Mark this task as skipped."""
        self.status = TaskStatus.SKIPPED

    # ── Display ──────────────────────────────────────────────────────────────

    def __str__(self) -> str:
        overdue_flag = " [OVERDUE]" if self.is_overdue() else ""
        return (
            f"[{self.task_id}] {self.due_time} | {self.task_type.value:<12} | "
            f"{self.priority.name:<6} | {self.name} ({self.pet_name})"
            f" - {self.status.value}{overdue_flag}"
        )


# ── Specialised Task subclasses ──────────────────────────────────────────────

@dataclass
class FeedingTask(Task):
    """A feeding task that tracks food type and amount."""
    food_type: str = "Dry Kibble"
    amount_grams: int = 200

    def __post_init__(self):
        self.task_type = TaskType.FEEDING


@dataclass
class WalkTask(Task):
    """A walk task that tracks expected distance."""
    distance_km: float = 1.0

    def __post_init__(self):
        self.task_type = TaskType.WALK


@dataclass
class MedicationTask(Task):
    """A medication task with drug name and dosage info."""
    medication_name: str = ""
    dosage: str = ""

    def __post_init__(self):
        self.task_type = TaskType.MEDICATION
        self.priority = Priority.HIGH          # Medications default to HIGH


@dataclass
class AppointmentTask(Task):
    """A vet appointment task with location and vet name."""
    vet_name: str = ""
    location: str = ""

    def __post_init__(self):
        self.task_type = TaskType.APPOINTMENT
        self.priority = Priority.HIGH


# ─────────────────────────────────────────────
# Pet
# ─────────────────────────────────────────────

class Pet:
    """Stores pet details and owns a list of tasks."""

    def __init__(self, name: str, species: str, breed: str,
                 age: int, owner_name: str, weight_kg: float = 0.0):
        self.name = name
        self.species = species
        self.breed = breed
        self.age = age
        self.owner_name = owner_name
        self.weight_kg = weight_kg
        self.tasks: list[Task] = []

    # ── Task management ──────────────────────────────────────────────────────

    def add_task(self, task: Task) -> None:
        """Append a task to this pet's task list."""
        task.pet_name = self.name
        task.owner_name = self.owner_name
        self.tasks.append(task)

    def remove_task(self, task_id: str) -> bool:
        """Remove a task by ID. Returns True if removed, False if not found."""
        for i, t in enumerate(self.tasks):
            if t.task_id == task_id:
                self.tasks.pop(i)
                return True
        return False

    def get_pending_tasks(self) -> list[Task]:
        """Return all tasks with PENDING status."""
        return [t for t in self.tasks if t.status == TaskStatus.PENDING]

    def get_tasks_for_date(self, target: date) -> list[Task]:
        """Return all tasks scheduled on the given date."""
        return [t for t in self.tasks if t.due_date == target]

    # ── Display ──────────────────────────────────────────────────────────────

    def __str__(self) -> str:
        return (
            f"{self.name} ({self.species} / {self.breed}) "
            f"- Age: {self.age}y  Weight: {self.weight_kg}kg  "
            f"Tasks: {len(self.tasks)}"
        )


# ─────────────────────────────────────────────
# Owner
# ─────────────────────────────────────────────

class Owner:
    """Manages a collection of pets and provides aggregate task access."""

    def __init__(self, name: str, email: str = "", phone: str = ""):
        self.name = name
        self.email = email
        self.phone = phone
        self.pets: list[Pet] = []

    # ── Pet management ───────────────────────────────────────────────────────

    def add_pet(self, pet: Pet) -> None:
        """Register a pet under this owner."""
        pet.owner_name = self.name
        self.pets.append(pet)

    def remove_pet(self, pet_name: str) -> bool:
        """Remove a pet by name. Returns True if found and removed."""
        for i, p in enumerate(self.pets):
            if p.name.lower() == pet_name.lower():
                self.pets.pop(i)
                return True
        return False

    def get_pet(self, pet_name: str) -> Optional[Pet]:
        """Look up a pet by name (case-insensitive)."""
        for p in self.pets:
            if p.name.lower() == pet_name.lower():
                return p
        return None

    def get_all_tasks(self) -> list[Task]:
        """Aggregate every task from every pet owned."""
        return [task for pet in self.pets for task in pet.tasks]

    def get_all_tasks_for_date(self, target: date) -> list[Task]:
        """Return all tasks across all pets for a given date."""
        return [t for t in self.get_all_tasks() if t.due_date == target]

    # ── Display ──────────────────────────────────────────────────────────────

    def __str__(self) -> str:
        return (
            f"Owner: {self.name}  |  Email: {self.email}  |"
            f"  Pets: {len(self.pets)}"
        )


# ─────────────────────────────────────────────
# Scheduler  — the algorithmic brain
# ─────────────────────────────────────────────

class Scheduler:
    """
    Retrieves, sorts, filters, and analyses tasks from an Owner.
    Provides conflict detection and recurring-task management.
    """

    def __init__(self, owner: Owner):
        self.owner = owner

    # ── Sorting ──────────────────────────────────────────────────────────────

    def sort_by_time(self, tasks: list[Task]) -> list[Task]:
        """Return tasks sorted chronologically by (date, time)."""
        return sorted(tasks, key=lambda t: (t.due_date, t.due_time))

    def sort_by_priority(self, tasks: list[Task]) -> list[Task]:
        """Return tasks sorted by priority (HIGH first), then by time."""
        return sorted(
            tasks,
            key=lambda t: (-t.priority.value, t.due_date, t.due_time),
        )

    # ── Filtering ────────────────────────────────────────────────────────────

    def filter_by_status(
        self, tasks: list[Task], status: TaskStatus
    ) -> list[Task]:
        """Filter tasks to only those matching the given status."""
        return [t for t in tasks if t.status == status]

    def filter_by_pet(self, tasks: list[Task], pet_name: str) -> list[Task]:
        """Filter tasks to only those belonging to the named pet."""
        return [t for t in tasks if t.pet_name.lower() == pet_name.lower()]

    def filter_by_type(
        self, tasks: list[Task], task_type: TaskType
    ) -> list[Task]:
        """Filter tasks by task type."""
        return [t for t in tasks if t.task_type == task_type]

    def filter_by_date(self, tasks: list[Task], target: date) -> list[Task]:
        """Filter tasks to a single calendar date."""
        return [t for t in tasks if t.due_date == target]

    # ── Today's Schedule ─────────────────────────────────────────────────────

    def todays_schedule(self) -> list[Task]:
        """Return today's pending tasks, sorted chronologically."""
        today = date.today()
        all_tasks = self.owner.get_all_tasks_for_date(today)
        return self.sort_by_time(all_tasks)

    def upcoming_schedule(self, days: int = 7) -> list[Task]:
        """Return all pending tasks in the next *days* days, sorted by time."""
        cutoff = date.today() + timedelta(days=days)
        tasks = [
            t for t in self.owner.get_all_tasks()
            if date.today() <= t.due_date <= cutoff
            and t.status == TaskStatus.PENDING
        ]
        return self.sort_by_time(tasks)

    # ── Conflict Detection ───────────────────────────────────────────────────

    def detect_conflicts(
        self, tasks: Optional[list[Task]] = None
    ) -> list[tuple[Task, Task, str]]:
        """
        Scan tasks for scheduling conflicts (overlapping windows).

        Returns a list of (task_a, task_b, reason) tuples.
        Two tasks conflict when they are for the SAME PET on the SAME DATE and
        their time windows overlap: start_a < end_b AND start_b < end_a.
        """
        if tasks is None:
            tasks = self.owner.get_all_tasks()

        pending = [t for t in tasks if t.status == TaskStatus.PENDING]
        conflicts: list[tuple[Task, Task, str]] = []

        for i in range(len(pending)):
            for j in range(i + 1, len(pending)):
                a, b = pending[i], pending[j]
                if a.pet_name != b.pet_name:
                    continue
                if a.due_date != b.due_date:
                    continue
                # Overlap: a starts before b ends AND b starts before a ends
                if a.datetime < b.end_datetime and b.datetime < a.end_datetime:
                    reason = (
                        f"'{a.name}' ({a.due_time}–{a.end_datetime.strftime('%H:%M')}) "
                        f"overlaps '{b.name}' ({b.due_time}–{b.end_datetime.strftime('%H:%M')})"
                        f" for {a.pet_name} on {a.due_date}"
                    )
                    conflicts.append((a, b, reason))

        return conflicts

    # ── Recurring Task Management ────────────────────────────────────────────

    def complete_task(self, task: Task) -> Optional[Task]:
        """
        Mark a task complete via the pet's task list.
        If the task recurs, the new instance is automatically added to the pet.
        Returns the newly created next-occurrence Task, or None.
        """
        pet = self.owner.get_pet(task.pet_name)
        if pet is None:
            return None

        next_task = task.mark_complete()
        if next_task is not None:
            pet.add_task(next_task)
        return next_task

    def get_overdue_tasks(self) -> list[Task]:
        """Return all pending tasks whose due datetime has passed."""
        return [t for t in self.owner.get_all_tasks() if t.is_overdue()]

    # ── Summary ──────────────────────────────────────────────────────────────

    def daily_summary(self, target: date = None) -> dict:
        """
        Produce a summary dict for a given day (defaults to today).
        Keys: total, pending, completed, conflicts, overdue.
        """
        if target is None:
            target = date.today()
        tasks = self.owner.get_all_tasks_for_date(target)
        return {
            "date": target,
            "total": len(tasks),
            "pending": len([t for t in tasks if t.status == TaskStatus.PENDING]),
            "completed": len([t for t in tasks if t.status == TaskStatus.COMPLETED]),
            "conflicts": len(self.detect_conflicts(tasks)),
            "overdue": len([t for t in tasks if t.is_overdue()]),
        }

    def print_schedule(self, tasks: list[Task], title: str = "Schedule") -> None:
        """Pretty-print a list of tasks to the terminal."""
        print(f"\n{'=' * 60}")
        print(f"  {title}")
        print(f"{'=' * 60}")
        if not tasks:
            print("  (no tasks)")
        for t in tasks:
            print(f"  {t}")
        print(f"{'-' * 60}\n")


# ─────────────────────────────────────────────
# PawPalSystem — top-level façade
# ─────────────────────────────────────────────

class PawPalSystem:
    """
    High-level façade that wires Owner, Pets, Tasks, and Scheduler together.
    Acts as the single entry-point for the Streamlit UI.
    """

    def __init__(self, owner_name: str, email: str = "", phone: str = ""):
        self.owner = Owner(owner_name, email, phone)
        self.scheduler = Scheduler(self.owner)

    # ── Convenience wrappers ─────────────────────────────────────────────────

    def add_pet(self, name: str, species: str, breed: str,
                age: int, weight_kg: float = 0.0) -> Pet:
        """Create and register a new pet under this system's owner."""
        pet = Pet(name, species, breed, age, self.owner.name, weight_kg)
        self.owner.add_pet(pet)
        return pet

    def add_task(self, pet_name: str, task: Task) -> bool:
        """Add a task to the named pet. Returns False if pet not found."""
        pet = self.owner.get_pet(pet_name)
        if pet is None:
            return False
        pet.add_task(task)
        return True

    def complete_task(self, task_id: str) -> tuple[bool, Optional[Task]]:
        """
        Complete a task by ID (searched across all pets).
        Returns (success, next_recurrence_or_None).
        """
        for pet in self.owner.pets:
            for task in pet.tasks:
                if task.task_id == task_id:
                    next_t = self.scheduler.complete_task(task)
                    return True, next_t
        return False, None

    def get_all_tasks(self) -> list[Task]:
        """Return every task across all pets."""
        return self.owner.get_all_tasks()

    def todays_schedule(self) -> list[Task]:
        """Return today's tasks in chronological order."""
        return self.scheduler.todays_schedule()

    def detect_conflicts(self) -> list[tuple[Task, Task, str]]:
        """Run conflict detection across all tasks."""
        return self.scheduler.detect_conflicts()

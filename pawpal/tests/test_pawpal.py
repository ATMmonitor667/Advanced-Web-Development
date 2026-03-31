"""
PawPal+ Automated Test Suite
Tests core behaviors: task lifecycle, OOP structure, sorting,
filtering, recurring tasks, and conflict detection.
"""

import pytest
from datetime import date, timedelta
from pawpal_system import (
    Owner, Pet, Task, FeedingTask, WalkTask, MedicationTask, AppointmentTask,
    Scheduler, PawPalSystem,
    Frequency, Priority, TaskStatus, TaskType,
)


# ─────────────────────────────────────────────
# Fixtures
# ─────────────────────────────────────────────

@pytest.fixture
def today():
    return date.today()


@pytest.fixture
def owner():
    return Owner("Test Owner", email="test@example.com")


@pytest.fixture
def pet(owner):
    p = Pet("Rex", "Dog", "Labrador", 4, owner.name, weight_kg=28.0)
    owner.add_pet(p)
    return p


@pytest.fixture
def system():
    s = PawPalSystem("Test Owner")
    s.add_pet("Rex",   "Dog",    "Labrador", 4, 28.0)
    s.add_pet("Misty", "Cat",    "Persian",  3, 3.5)
    return s


@pytest.fixture
def base_task(today):
    return FeedingTask(
        name="Morning Feed",
        task_type=TaskType.FEEDING,
        due_date=today,
        due_time="08:00",
        pet_name="Rex",
        owner_name="Test Owner",
        frequency=Frequency.DAILY,
        duration_minutes=10,
    )


# ─────────────────────────────────────────────
# 1. Task Lifecycle
# ─────────────────────────────────────────────

class TestTaskLifecycle:

    def test_new_task_is_pending(self, base_task):
        """A freshly created task should have PENDING status."""
        assert base_task.status == TaskStatus.PENDING

    def test_mark_complete_changes_status(self, base_task):
        """mark_complete() must flip status to COMPLETED."""
        base_task.mark_complete()
        assert base_task.status == TaskStatus.COMPLETED

    def test_mark_skipped_changes_status(self, base_task):
        """mark_skipped() must flip status to SKIPPED."""
        base_task.mark_skipped()
        assert base_task.status == TaskStatus.SKIPPED

    def test_once_frequency_returns_no_next_task(self, today):
        """A ONCE task should return None when completed (no recurrence)."""
        task = WalkTask(
            name="One-off Walk", task_type=TaskType.WALK,
            due_date=today, due_time="10:00",
            pet_name="Rex", owner_name="Test Owner",
            frequency=Frequency.ONCE,
        )
        result = task.mark_complete()
        assert result is None

    def test_task_has_unique_id(self, today):
        """Two separate Task instances must have different task_ids."""
        t1 = FeedingTask(
            name="Feed A", task_type=TaskType.FEEDING,
            due_date=today, due_time="08:00",
            pet_name="Rex", owner_name="Test Owner",
        )
        t2 = FeedingTask(
            name="Feed B", task_type=TaskType.FEEDING,
            due_date=today, due_time="09:00",
            pet_name="Rex", owner_name="Test Owner",
        )
        assert t1.task_id != t2.task_id


# ─────────────────────────────────────────────
# 2. Pet Task Management
# ─────────────────────────────────────────────

class TestPetTaskManagement:

    def test_add_task_increases_count(self, pet, base_task):
        """Adding one task should increase the pet's task list by 1."""
        before = len(pet.tasks)
        pet.add_task(base_task)
        assert len(pet.tasks) == before + 1

    def test_add_multiple_tasks(self, pet, today):
        """Pet should hold all added tasks."""
        for i in range(5):
            pet.add_task(FeedingTask(
                name=f"Feed {i}", task_type=TaskType.FEEDING,
                due_date=today, due_time=f"{8 + i:02d}:00",
                pet_name=pet.name, owner_name=pet.owner_name,
            ))
        assert len(pet.tasks) == 5

    def test_remove_task_by_id(self, pet, base_task):
        """Removing a task by ID should decrease the task count."""
        pet.add_task(base_task)
        removed = pet.remove_task(base_task.task_id)
        assert removed is True
        assert len(pet.tasks) == 0

    def test_remove_nonexistent_task_returns_false(self, pet):
        """Removing a non-existent task ID should return False."""
        assert pet.remove_task("no-such-id") is False

    def test_get_pending_tasks(self, pet, today):
        """get_pending_tasks should exclude completed and skipped tasks."""
        t1 = FeedingTask(
            name="Feed A", task_type=TaskType.FEEDING,
            due_date=today, due_time="08:00",
            pet_name=pet.name, owner_name=pet.owner_name,
        )
        t2 = FeedingTask(
            name="Feed B", task_type=TaskType.FEEDING,
            due_date=today, due_time="12:00",
            pet_name=pet.name, owner_name=pet.owner_name,
        )
        pet.add_task(t1)
        pet.add_task(t2)
        t1.mark_complete()
        pending = pet.get_pending_tasks()
        assert len(pending) == 1
        assert pending[0].name == "Feed B"


# ─────────────────────────────────────────────
# 3. Owner
# ─────────────────────────────────────────────

class TestOwner:

    def test_add_pet_increases_count(self, owner):
        """Owner.add_pet should grow the pets list."""
        owner.add_pet(Pet("Fluffy", "Cat", "Maine Coon", 2, owner.name))
        assert len(owner.pets) == 1

    def test_get_pet_by_name(self, owner, pet):
        """Owner.get_pet should return the correct pet by name."""
        found = owner.get_pet("Rex")
        assert found is not None
        assert found.name == "Rex"

    def test_get_pet_case_insensitive(self, owner, pet):
        """Name lookup should be case-insensitive."""
        assert owner.get_pet("rex") is not None
        assert owner.get_pet("REX") is not None

    def test_get_pet_not_found_returns_none(self, owner):
        """Searching for a non-existent pet should return None."""
        assert owner.get_pet("Ghost") is None

    def test_get_all_tasks_aggregates(self, owner, today):
        """get_all_tasks should return tasks from all pets."""
        p1 = Pet("Alpha", "Dog", "Poodle", 1, owner.name)
        p2 = Pet("Beta",  "Dog", "Poodle", 2, owner.name)
        owner.add_pet(p1)
        owner.add_pet(p2)
        p1.add_task(FeedingTask(
            name="Feed", task_type=TaskType.FEEDING,
            due_date=today, due_time="08:00",
            pet_name="Alpha", owner_name=owner.name,
        ))
        p2.add_task(WalkTask(
            name="Walk", task_type=TaskType.WALK,
            due_date=today, due_time="09:00",
            pet_name="Beta", owner_name=owner.name,
        ))
        assert len(owner.get_all_tasks()) == 2


# ─────────────────────────────────────────────
# 4. Scheduler — Sorting
# ─────────────────────────────────────────────

class TestSchedulerSorting:

    def test_sort_by_time_chronological(self, system, today):
        """Tasks added out of order should be sorted chronologically."""
        times = ["14:00", "08:00", "20:00", "06:30"]
        for t in times:
            system.add_task("Rex", WalkTask(
                name=f"Walk {t}", task_type=TaskType.WALK,
                due_date=today, due_time=t,
                pet_name="Rex", owner_name=system.owner.name,
            ))

        all_tasks = system.get_all_tasks()
        sorted_tasks = system.scheduler.sort_by_time(all_tasks)
        times_out = [t.due_time for t in sorted_tasks]
        assert times_out == sorted(times_out)

    def test_sort_by_priority_high_first(self, system, today):
        """HIGH priority tasks should come first after sort_by_priority."""
        system.add_task("Rex", FeedingTask(
            name="Low Prio", task_type=TaskType.FEEDING,
            due_date=today, due_time="09:00",
            pet_name="Rex", owner_name=system.owner.name,
            priority=Priority.LOW,
        ))
        system.add_task("Rex", MedicationTask(
            name="High Prio Med", task_type=TaskType.MEDICATION,
            due_date=today, due_time="10:00",
            pet_name="Rex", owner_name=system.owner.name,
        ))
        sorted_tasks = system.scheduler.sort_by_priority(system.get_all_tasks())
        assert sorted_tasks[0].priority == Priority.HIGH


# ─────────────────────────────────────────────
# 5. Scheduler — Filtering
# ─────────────────────────────────────────────

class TestSchedulerFiltering:

    def test_filter_by_pet(self, system, today):
        """filter_by_pet should return only that pet's tasks."""
        system.add_task("Rex", FeedingTask(
            name="Rex Feed", task_type=TaskType.FEEDING,
            due_date=today, due_time="08:00",
            pet_name="Rex", owner_name=system.owner.name,
        ))
        system.add_task("Misty", FeedingTask(
            name="Misty Feed", task_type=TaskType.FEEDING,
            due_date=today, due_time="08:00",
            pet_name="Misty", owner_name=system.owner.name,
        ))
        rex_tasks = system.scheduler.filter_by_pet(system.get_all_tasks(), "Rex")
        assert all(t.pet_name == "Rex" for t in rex_tasks)
        assert len(rex_tasks) == 1

    def test_filter_by_status_pending_only(self, system, today):
        """filter_by_status should exclude completed tasks."""
        t = FeedingTask(
            name="Feed", task_type=TaskType.FEEDING,
            due_date=today, due_time="08:00",
            pet_name="Rex", owner_name=system.owner.name,
        )
        system.add_task("Rex", t)
        t.mark_complete()
        pending = system.scheduler.filter_by_status(
            system.get_all_tasks(), TaskStatus.PENDING
        )
        assert all(x.status == TaskStatus.PENDING for x in pending)

    def test_filter_by_type(self, system, today):
        """filter_by_type should return only the specified task type."""
        system.add_task("Rex", FeedingTask(
            name="Feed", task_type=TaskType.FEEDING,
            due_date=today, due_time="08:00",
            pet_name="Rex", owner_name=system.owner.name,
        ))
        system.add_task("Rex", WalkTask(
            name="Walk", task_type=TaskType.WALK,
            due_date=today, due_time="10:00",
            pet_name="Rex", owner_name=system.owner.name,
        ))
        walks = system.scheduler.filter_by_type(
            system.get_all_tasks(), TaskType.WALK
        )
        assert len(walks) == 1
        assert walks[0].task_type == TaskType.WALK


# ─────────────────────────────────────────────
# 6. Scheduler — Recurring Tasks
# ─────────────────────────────────────────────

class TestRecurringTasks:

    def test_daily_task_creates_next_occurrence(self, system, today):
        """Completing a DAILY task should schedule a new one for tomorrow."""
        task = FeedingTask(
            name="Daily Feed", task_type=TaskType.FEEDING,
            due_date=today, due_time="08:00",
            pet_name="Rex", owner_name=system.owner.name,
            frequency=Frequency.DAILY,
        )
        system.add_task("Rex", task)
        _ok, next_task = system.complete_task(task.task_id)
        assert next_task is not None
        assert next_task.due_date == today + timedelta(days=1)
        assert next_task.status == TaskStatus.PENDING

    def test_weekly_task_creates_next_occurrence(self, system, today):
        """Completing a WEEKLY task should schedule one 7 days later."""
        task = WalkTask(
            name="Weekly Hike", task_type=TaskType.WALK,
            due_date=today, due_time="09:00",
            pet_name="Rex", owner_name=system.owner.name,
            frequency=Frequency.WEEKLY,
        )
        system.add_task("Rex", task)
        _ok, next_task = system.complete_task(task.task_id)
        assert next_task is not None
        assert next_task.due_date == today + timedelta(weeks=1)

    def test_monthly_task_creates_next_occurrence(self, system, today):
        """Completing a MONTHLY task should schedule one ~30 days later."""
        task = MedicationTask(
            name="Monthly Med", task_type=TaskType.MEDICATION,
            due_date=today, due_time="09:00",
            pet_name="Rex", owner_name=system.owner.name,
            frequency=Frequency.MONTHLY,
        )
        system.add_task("Rex", task)
        _ok, next_task = system.complete_task(task.task_id)
        assert next_task is not None
        assert next_task.due_date == today + timedelta(days=30)

    def test_recurring_task_added_to_pet(self, system, today):
        """The new recurrence task should appear in the pet's task list."""
        task = FeedingTask(
            name="Recurring Feed", task_type=TaskType.FEEDING,
            due_date=today, due_time="08:00",
            pet_name="Rex", owner_name=system.owner.name,
            frequency=Frequency.DAILY,
        )
        system.add_task("Rex", task)
        initial_count = len(system.owner.get_pet("Rex").tasks)
        system.complete_task(task.task_id)
        new_count = len(system.owner.get_pet("Rex").tasks)
        assert new_count == initial_count + 1

    def test_next_task_has_different_id(self, system, today):
        """The next recurrence must have a fresh unique task_id."""
        task = FeedingTask(
            name="Feed", task_type=TaskType.FEEDING,
            due_date=today, due_time="08:00",
            pet_name="Rex", owner_name=system.owner.name,
            frequency=Frequency.DAILY,
        )
        system.add_task("Rex", task)
        _ok, next_task = system.complete_task(task.task_id)
        assert next_task.task_id != task.task_id


# ─────────────────────────────────────────────
# 7. Conflict Detection
# ─────────────────────────────────────────────

class TestConflictDetection:

    def test_exact_same_time_is_conflict(self, system, today):
        """Two tasks for the same pet at the same time must be flagged."""
        for name in ("Task A", "Task B"):
            system.add_task("Rex", FeedingTask(
                name=name, task_type=TaskType.FEEDING,
                due_date=today, due_time="09:00",
                pet_name="Rex", owner_name=system.owner.name,
                duration_minutes=30,
            ))
        conflicts = system.detect_conflicts()
        assert len(conflicts) >= 1

    def test_overlapping_times_is_conflict(self, system, today):
        """A task starting inside another task's window is a conflict."""
        system.add_task("Rex", WalkTask(
            name="Long Walk", task_type=TaskType.WALK,
            due_date=today, due_time="10:00",
            pet_name="Rex", owner_name=system.owner.name,
            duration_minutes=60,
        ))
        system.add_task("Rex", FeedingTask(
            name="Mid-Walk Feed", task_type=TaskType.FEEDING,
            due_date=today, due_time="10:30",
            pet_name="Rex", owner_name=system.owner.name,
            duration_minutes=15,
        ))
        conflicts = system.detect_conflicts()
        assert len(conflicts) >= 1

    def test_non_overlapping_times_no_conflict(self, system, today):
        """Tasks that don't overlap should produce zero conflicts."""
        system.add_task("Rex", FeedingTask(
            name="Morning Feed", task_type=TaskType.FEEDING,
            due_date=today, due_time="08:00",
            pet_name="Rex", owner_name=system.owner.name,
            duration_minutes=15,
        ))
        system.add_task("Rex", WalkTask(
            name="Afternoon Walk", task_type=TaskType.WALK,
            due_date=today, due_time="15:00",
            pet_name="Rex", owner_name=system.owner.name,
            duration_minutes=30,
        ))
        conflicts = system.detect_conflicts()
        assert len(conflicts) == 0

    def test_different_pets_no_conflict(self, system, today):
        """Tasks at the same time for different pets should NOT conflict."""
        for pet_name in ("Rex", "Misty"):
            system.add_task(pet_name, FeedingTask(
                name="Simultaneous Feed", task_type=TaskType.FEEDING,
                due_date=today, due_time="09:00",
                pet_name=pet_name, owner_name=system.owner.name,
                duration_minutes=10,
            ))
        conflicts = system.detect_conflicts()
        assert len(conflicts) == 0

    def test_completed_tasks_not_flagged(self, system, today):
        """Completed tasks should be excluded from conflict detection."""
        t1 = FeedingTask(
            name="Done Feed", task_type=TaskType.FEEDING,
            due_date=today, due_time="09:00",
            pet_name="Rex", owner_name=system.owner.name,
            duration_minutes=30,
        )
        t2 = FeedingTask(
            name="Active Feed", task_type=TaskType.FEEDING,
            due_date=today, due_time="09:00",
            pet_name="Rex", owner_name=system.owner.name,
            duration_minutes=30,
        )
        system.add_task("Rex", t1)
        system.add_task("Rex", t2)
        t1.mark_complete()
        conflicts = system.detect_conflicts()
        assert len(conflicts) == 0


# ─────────────────────────────────────────────
# 8. Edge Cases
# ─────────────────────────────────────────────

class TestEdgeCases:

    def test_pet_with_no_tasks(self, system):
        """A pet with no tasks should return empty lists without error."""
        pet = system.owner.get_pet("Rex")
        assert pet.get_pending_tasks() == []
        assert pet.get_tasks_for_date(date.today()) == []

    def test_todays_schedule_empty_when_no_tasks(self, system):
        """todays_schedule on a fresh system should return empty list."""
        assert system.todays_schedule() == []

    def test_complete_nonexistent_task_returns_false(self, system):
        """Completing a bogus task ID should not raise and should return False."""
        ok, next_t = system.complete_task("nonexistent-id")
        assert ok is False
        assert next_t is None

    def test_overdue_task_detected(self, system):
        """A pending task with a past due datetime should be flagged as overdue."""
        yesterday = date.today() - timedelta(days=1)
        system.add_task("Rex", FeedingTask(
            name="Missed Feed", task_type=TaskType.FEEDING,
            due_date=yesterday, due_time="08:00",
            pet_name="Rex", owner_name=system.owner.name,
        ))
        overdue = system.scheduler.get_overdue_tasks()
        assert len(overdue) == 1

    def test_daily_summary_counts(self, system, today):
        """daily_summary should count tasks correctly."""
        system.add_task("Rex", FeedingTask(
            name="Feed", task_type=TaskType.FEEDING,
            due_date=today, due_time="08:00",
            pet_name="Rex", owner_name=system.owner.name,
        ))
        summary = system.scheduler.daily_summary(today)
        assert summary["total"] == 1
        assert summary["pending"] == 1
        assert summary["completed"] == 0

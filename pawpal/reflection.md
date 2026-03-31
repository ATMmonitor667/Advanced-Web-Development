# PawPal+ — Project Reflection

---

## Section 1 — System Design

### 1a. Initial Design

Before writing any code, I identified three core actions a user should be able to perform:

1. **Add a pet** — register a pet (name, species, breed, age, weight) under an owner account
2. **Schedule a task** — attach a care task (feeding, walk, medication, appointment) to a specific pet with a date, time, frequency, and priority
3. **View today's schedule** — see all tasks due today across all pets, sorted chronologically, with conflict and overdue warnings

From these actions, I derived four primary classes:

| Class | Responsibility |
|-------|---------------|
| `Task` (+ subclasses) | Represent a single care activity; track its status and handle recurrence when completed |
| `Pet` | Store pet attributes and own a personal list of tasks |
| `Owner` | Manage a collection of pets; aggregate tasks across all of them |
| `Scheduler` | Apply algorithmic logic — sort, filter, conflict-detect, and manage recurring tasks |
| `PawPalSystem` | Top-level façade that wires everything together and serves as the single entry point for the UI |

I chose Python **dataclasses** for `Task` and its subclasses because they eliminate boilerplate `__init__` code and make attribute definitions self-documenting. Enumerations (`TaskType`, `Frequency`, `Priority`, `TaskStatus`) were used for all finite-state fields to prevent "magic strings" throughout the codebase.

### 1b. Design Changes

During implementation, several design adjustments were made:

- **Added `PawPalSystem` façade** — originally the UI was going to talk directly to `Owner` and `Scheduler`, but a thin façade class made the Streamlit code much cleaner and easier to maintain.
- **Subclassed `Task` instead of using a `type` flag** — initial designs used a single `Task` class with a `task_type` string. Switching to `FeedingTask`, `WalkTask`, `MedicationTask`, and `AppointmentTask` subclasses allowed type-specific extra fields (e.g., `medication_name`, `distance_km`) without polluting the base class.
- **Made recurring logic return the new task** — initially `mark_complete()` was a void method. Making it return the next-occurrence `Task` (or `None`) kept the mutation logic inside the `Task` itself while letting the `Scheduler` decide whether to add it to the pet, which respects the Single Responsibility Principle.
- **Added `duration_minutes` to `Task`** — conflict detection requires knowing when a task *ends*, not just when it *starts*. Adding duration as a base-class field made the overlap calculation straightforward.

---

## Section 2 — Algorithmic Layer

### 2a. Algorithms Implemented

**Sorting:**
- `sort_by_time(tasks)` — uses Python's built-in `sorted()` with a `(due_date, due_time)` tuple key. Sorting `"HH:MM"` strings lexicographically works correctly because they are zero-padded (e.g., `"08:00" < "18:00"`). Time complexity: O(n log n).
- `sort_by_priority(tasks)` — uses `(-priority.value, due_date, due_time)` as the key to place HIGH-priority tasks first while maintaining chronological order within each priority level.

**Filtering:**
- Four composable filter methods (`filter_by_status`, `filter_by_pet`, `filter_by_type`, `filter_by_date`) implemented as list comprehensions. These can be chained freely in the UI.

**Conflict Detection:**
- O(n²) pairwise scan of pending tasks for the same pet on the same date. Two tasks conflict when their time windows overlap: `start_a < end_b AND start_b < end_a`. Returns descriptive reason strings rather than raising exceptions, so the UI can display warnings gracefully.

**Recurring Tasks:**
- `Task.mark_complete()` computes the next due date using `timedelta`: daily → +1 day, weekly → +7 days, monthly → +30 days. It uses `dataclasses.replace()` to create a clean copy with a new `task_id` and `PENDING` status. The `Scheduler.complete_task()` wrapper then appends the new instance to the pet's task list automatically.

**Overdue Detection:**
- `Task.is_overdue()` compares the task's combined `datetime` against `datetime.now()`. This is a computed property, so it always reflects the current time without needing to update stored data.

### 2b. Tradeoffs

| Tradeoff | Choice Made | Reason |
|----------|------------|--------|
| Conflict granularity | Only checks same-pet, same-date overlapping time windows | Semantic conflicts (e.g., "don't feed immediately after walk") would require domain-specific rules beyond what a generic scheduler can know |
| Monthly recurrence | `+30 days` instead of calendar-accurate "next calendar month" | `timedelta(days=30)` is deterministic and simple; calendar month arithmetic (Feb 28 vs 31-day months) would require the `dateutil` library and add complexity for a minor gain |
| Storage | All data in-memory (Python objects) | Appropriate for a prototype; persistence would require serialisation (JSON/SQLite) which was out of scope |
| Conflict algorithm | O(n²) brute-force scan | Correct and readable for household-scale use (< 100 tasks); at scale, an interval tree or sorted event list would reduce this to O(n log n) |
| Exact-time vs. fuzzy time conflict | Exact window overlap | A "30-minute buffer" between tasks could be useful UX, but the spec called for conflict *detection*, not conflict *prevention*, so I kept the logic minimal and clear |

---

## Section 3 — AI Strategy & Collaboration

### Which AI features were most effective?

Working with AI as a design and scaffolding partner was most valuable in two moments:

1. **Initial class skeleton generation** — describing the four core classes and their relationships in plain English, then asking for a Mermaid.js UML diagram, gave a visual sanity check on the design before a single line of Python was written. It surfaced the missing `duration_minutes` field (needed for conflict detection) that I hadn't thought of during initial brainstorming.

2. **Test generation** — asking AI to draft edge-case tests (e.g., "completed tasks should not be flagged in conflict detection," "ONCE frequency returns None on completion") caught boundary conditions I would have tested manually but might have forgotten to formalise in pytest.

### One AI suggestion I rejected

AI initially suggested using a `@property` that computed `is_overdue` by comparing against a **hardcoded** `datetime(2024, ...)` anchor rather than `datetime.now()`. This would have made tests always pass in development but silently break in production as time passed. I replaced it with `datetime.now()` and noted in the tests that overdue detection is inherently time-dependent — meaning the test fixture uses `yesterday = date.today() - timedelta(days=1)` to guarantee the condition.

### How separate chat sessions helped

Using distinct chat sessions for (a) system design, (b) algorithmic implementation, and (c) test generation prevented context contamination. When asking for test generation, AI had no memory of implementation shortcuts taken earlier and therefore suggested more adversarial edge cases. Keeping phases isolated forced cleaner, more focused prompts.

### Role as Lead Architect

The most important human contributions in this workflow were:

- **Choosing what NOT to build** — AI suggestions often included unnecessary complexity (persistence, authentication, external API integrations). Rejecting these kept the codebase focused on the actual learning goals.
- **Evaluating tradeoffs** — AI can generate both a simple O(n²) conflict scanner and a complex interval-tree solution; deciding which is appropriate for the problem scale requires human judgment.
- **Maintaining coherence across phases** — AI has no persistent memory between sessions. The human architect must carry the conceptual thread from UML to implementation to tests to UI, ensuring that each phase builds on the last rather than reinventing decisions.
- **Reading generated code critically** — AI-generated code is often syntactically correct but occasionally semantically wrong (e.g., the hardcoded datetime example above). The human review step is non-negotiable.

The core lesson: AI is an exceptionally fast *drafter* and *brainstormer*, but the *architect* role — deciding what the system should do, what tradeoffs are acceptable, and what quality bar must be met — remains firmly human.

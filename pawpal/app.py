"""
PawPal+ Streamlit UI
Smart pet care management — tracks feedings, walks, medications, and appointments.
"""

import streamlit as st
from datetime import date, timedelta
from pawpal_system import (
    PawPalSystem, Pet,
    FeedingTask, WalkTask, MedicationTask, AppointmentTask,
    Frequency, Priority, TaskStatus, TaskType,
)

# ─────────────────────────────────────────────
# Page Config
# ─────────────────────────────────────────────

st.set_page_config(
    page_title="PawPal+",
    page_icon="🐾",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ─────────────────────────────────────────────
# Session State — persistent "memory"
# ─────────────────────────────────────────────

if "system" not in st.session_state:
    st.session_state.system = PawPalSystem(
        "My Household", email="owner@pawpal.com"
    )
    # Seed with sample data so the UI isn't empty on first load
    sys = st.session_state.system
    sys.add_pet("Buddy", "Dog",    "Golden Retriever", 3, 30.5)
    sys.add_pet("Luna",  "Cat",    "Siamese",          5,  4.2)
    today = date.today()
    sys.add_task("Buddy", FeedingTask(
        name="Morning Feed", task_type=TaskType.FEEDING,
        due_date=today, due_time="08:00",
        pet_name="Buddy", owner_name=sys.owner.name,
        frequency=Frequency.DAILY, duration_minutes=10,
        food_type="Dry Kibble", amount_grams=300,
    ))
    sys.add_task("Buddy", WalkTask(
        name="Evening Walk", task_type=TaskType.WALK,
        due_date=today, due_time="18:00",
        pet_name="Buddy", owner_name=sys.owner.name,
        frequency=Frequency.DAILY, duration_minutes=45,
        distance_km=3.0,
    ))
    sys.add_task("Buddy", MedicationTask(
        name="Flea Treatment", task_type=TaskType.MEDICATION,
        due_date=today, due_time="09:00",
        pet_name="Buddy", owner_name=sys.owner.name,
        frequency=Frequency.MONTHLY, duration_minutes=5,
        medication_name="NexGard", dosage="1 chew",
    ))
    sys.add_task("Luna", FeedingTask(
        name="Lunch Feed", task_type=TaskType.FEEDING,
        due_date=today, due_time="12:30",
        pet_name="Luna", owner_name=sys.owner.name,
        frequency=Frequency.DAILY, duration_minutes=5,
        food_type="Wet Food", amount_grams=100,
    ))
    sys.add_task("Luna", MedicationTask(
        name="Thyroid Meds", task_type=TaskType.MEDICATION,
        due_date=today, due_time="08:30",
        pet_name="Luna", owner_name=sys.owner.name,
        frequency=Frequency.DAILY, duration_minutes=5,
        medication_name="Methimazole", dosage="2.5mg",
    ))

system: PawPalSystem = st.session_state.system

# ─────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────

TASK_TYPE_ICONS = {
    TaskType.FEEDING:     "🍖",
    TaskType.WALK:        "🦮",
    TaskType.MEDICATION:  "💊",
    TaskType.APPOINTMENT: "🏥",
}

STATUS_COLORS = {
    TaskStatus.PENDING:   "🟡",
    TaskStatus.COMPLETED: "✅",
    TaskStatus.SKIPPED:   "⏭️",
}

SPECIES_ICONS = {"Dog": "🐶", "Cat": "🐱", "Rabbit": "🐰",
                 "Bird": "🐦", "Fish": "🐟", "Other": "🐾"}


def task_row(task) -> dict:
    """Convert a Task to a display dict for st.dataframe."""
    overdue = "⚠️ OVERDUE" if task.is_overdue() else ""
    return {
        "ID":        task.task_id,
        "Time":      task.due_time,
        "Type":      f"{TASK_TYPE_ICONS.get(task.task_type,'')} {task.task_type.value}",
        "Task":      task.name,
        "Pet":       task.pet_name,
        "Priority":  task.priority.name,
        "Frequency": task.frequency.value,
        "Status":    f"{STATUS_COLORS.get(task.status,'')} {task.status.value}",
        "Overdue":   overdue,
    }


# ─────────────────────────────────────────────
# Sidebar — Navigation
# ─────────────────────────────────────────────

with st.sidebar:
    st.title("🐾 PawPal+")
    st.caption("Smart Pet Care Manager")
    st.divider()
    page = st.radio(
        "Navigate",
        ["🏠 Dashboard", "🐾 My Pets", "📋 All Tasks",
         "➕ Add Task", "⚙️ Settings"],
        label_visibility="collapsed",
    )
    st.divider()
    # Quick stats
    all_tasks  = system.get_all_tasks()
    total_pets = len(system.owner.pets)
    pending    = [t for t in all_tasks if t.status == TaskStatus.PENDING]
    overdue    = system.scheduler.get_overdue_tasks()
    conflicts  = system.detect_conflicts()

    st.metric("Pets",     total_pets)
    st.metric("Pending",  len(pending))
    if overdue:
        st.metric("Overdue ⚠️", len(overdue))
    if conflicts:
        st.metric("Conflicts 🔴", len(conflicts))


# ─────────────────────────────────────────────
# Page: Dashboard
# ─────────────────────────────────────────────

if page == "🏠 Dashboard":
    st.title("🏠 Dashboard")
    summary = system.scheduler.daily_summary(date.today())

    # KPI row
    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Today's Tasks",  summary["total"])
    c2.metric("Pending",        summary["pending"])
    c3.metric("Completed",      summary["completed"])
    c4.metric("Conflicts",      summary["conflicts"],
              delta=f"{summary['conflicts']} issue(s)" if summary["conflicts"] else None,
              delta_color="inverse")

    # Conflict warnings
    if conflicts:
        st.divider()
        st.subheader("⚠️ Scheduling Conflicts")
        for a, b, reason in conflicts:
            st.warning(f"**Conflict detected:** {reason}")

    # Overdue tasks
    if overdue:
        st.divider()
        st.subheader("🕐 Overdue Tasks")
        for t in overdue:
            st.error(
                f"**{t.name}** for **{t.pet_name}** was due "
                f"{t.due_date} at {t.due_time} — still PENDING"
            )

    # Today's schedule
    st.divider()
    st.subheader(f"📅 Today's Schedule — {date.today().strftime('%A, %B %d %Y')}")
    todays = system.todays_schedule()
    if todays:
        st.dataframe(
            [task_row(t) for t in todays],
            use_container_width=True,
            hide_index=True,
        )
    else:
        st.info("No tasks scheduled for today.")

    # 7-day upcoming
    st.divider()
    st.subheader("📆 Upcoming 7 Days")
    upcoming = system.scheduler.upcoming_schedule(days=7)
    if upcoming:
        st.dataframe(
            [task_row(t) for t in upcoming],
            use_container_width=True,
            hide_index=True,
        )
    else:
        st.info("No upcoming tasks in the next 7 days.")


# ─────────────────────────────────────────────
# Page: My Pets
# ─────────────────────────────────────────────

elif page == "🐾 My Pets":
    st.title("🐾 My Pets")

    # Add-pet form
    with st.expander("➕ Add a New Pet", expanded=False):
        with st.form("add_pet_form"):
            cols = st.columns(2)
            pet_name    = cols[0].text_input("Pet Name *")
            species     = cols[1].selectbox("Species", ["Dog","Cat","Rabbit","Bird","Fish","Other"])
            breed       = cols[0].text_input("Breed")
            age         = cols[1].number_input("Age (years)", min_value=0, max_value=50, value=1)
            weight      = cols[0].number_input("Weight (kg)", min_value=0.0, value=0.0, step=0.1)
            submitted   = st.form_submit_button("Add Pet")
            if submitted:
                if not pet_name.strip():
                    st.error("Pet name is required.")
                elif system.owner.get_pet(pet_name.strip()):
                    st.error(f"A pet named '{pet_name}' already exists.")
                else:
                    system.add_pet(pet_name.strip(), species, breed, int(age), float(weight))
                    st.success(f"🎉 {pet_name} has been added!")
                    st.rerun()

    st.divider()

    if not system.owner.pets:
        st.info("No pets yet. Add one above!")
    else:
        for pet in system.owner.pets:
            icon = SPECIES_ICONS.get(pet.species, "🐾")
            with st.container(border=True):
                col1, col2 = st.columns([3, 1])
                with col1:
                    st.subheader(f"{icon} {pet.name}")
                    st.write(f"**Species:** {pet.species}  |  **Breed:** {pet.breed}  |  "
                             f"**Age:** {pet.age}y  |  **Weight:** {pet.weight_kg}kg")
                with col2:
                    pending_count = len(pet.get_pending_tasks())
                    st.metric("Pending Tasks", pending_count)

                pet_tasks = system.scheduler.sort_by_time(pet.tasks)
                if pet_tasks:
                    st.dataframe(
                        [task_row(t) for t in pet_tasks],
                        use_container_width=True,
                        hide_index=True,
                    )

                # Delete pet button
                if st.button(f"🗑️ Remove {pet.name}", key=f"del_{pet.name}"):
                    system.owner.remove_pet(pet.name)
                    st.success(f"{pet.name} removed.")
                    st.rerun()


# ─────────────────────────────────────────────
# Page: All Tasks
# ─────────────────────────────────────────────

elif page == "📋 All Tasks":
    st.title("📋 All Tasks")

    # Filters
    col1, col2, col3 = st.columns(3)
    pet_options   = ["All"] + [p.name for p in system.owner.pets]
    status_filter = col1.selectbox("Status", ["All"] + [s.value for s in TaskStatus])
    pet_filter    = col2.selectbox("Pet",    pet_options)
    type_filter   = col3.selectbox("Type",   ["All"] + [t.value for t in TaskType])

    sort_by = st.radio("Sort by", ["Time", "Priority"], horizontal=True)

    tasks = system.get_all_tasks()
    if status_filter != "All":
        status_enum = TaskStatus(status_filter)
        tasks = system.scheduler.filter_by_status(tasks, status_enum)
    if pet_filter != "All":
        tasks = system.scheduler.filter_by_pet(tasks, pet_filter)
    if type_filter != "All":
        type_enum = TaskType(type_filter)
        tasks = system.scheduler.filter_by_type(tasks, type_enum)

    tasks = (system.scheduler.sort_by_priority(tasks)
             if sort_by == "Priority"
             else system.scheduler.sort_by_time(tasks))

    st.caption(f"{len(tasks)} task(s) shown")
    if tasks:
        st.dataframe(
            [task_row(t) for t in tasks],
            use_container_width=True,
            hide_index=True,
        )

        # Complete / Skip by ID
        st.divider()
        st.subheader("Mark a Task")
        id_input = st.text_input("Enter Task ID")
        c1, c2 = st.columns(2)
        if c1.button("✅ Mark Complete"):
            ok, next_t = system.complete_task(id_input.strip())
            if ok:
                st.success("Task marked complete!" + (
                    f" Next occurrence: {next_t.due_date} at {next_t.due_time}"
                    if next_t else ""
                ))
                st.rerun()
            else:
                st.error("Task ID not found.")
        if c2.button("⏭️ Mark Skipped"):
            found = False
            for t in system.get_all_tasks():
                if t.task_id == id_input.strip():
                    t.mark_skipped()
                    found = True
                    break
            if found:
                st.success("Task marked skipped.")
                st.rerun()
            else:
                st.error("Task ID not found.")
    else:
        st.info("No tasks match the current filters.")


# ─────────────────────────────────────────────
# Page: Add Task
# ─────────────────────────────────────────────

elif page == "➕ Add Task":
    st.title("➕ Schedule a New Task")

    if not system.owner.pets:
        st.warning("Add at least one pet before scheduling tasks.")
    else:
        task_type = st.selectbox(
            "Task Type",
            [t.value for t in TaskType],
            format_func=lambda v: f"{TASK_TYPE_ICONS.get(TaskType(v),'')} {v}",
        )

        with st.form("add_task_form"):
            st.subheader(f"{TASK_TYPE_ICONS.get(TaskType(task_type),'')} {task_type} Details")
            cols = st.columns(2)

            # Common fields
            task_name   = cols[0].text_input("Task Name *")
            pet_choice  = cols[1].selectbox("Pet *", [p.name for p in system.owner.pets])
            due_date    = cols[0].date_input("Due Date", value=date.today())
            due_time    = cols[1].time_input("Due Time")
            frequency   = cols[0].selectbox("Frequency", [f.value for f in Frequency])
            priority    = cols[1].selectbox("Priority",  [p.name for p in Priority],
                                             index=1)
            duration    = cols[0].number_input("Duration (minutes)", min_value=1, value=30)
            notes       = st.text_area("Notes (optional)", height=80)

            # Type-specific extras
            extras: dict = {}
            if task_type == TaskType.FEEDING.value:
                e1, e2 = st.columns(2)
                extras["food_type"]    = e1.text_input("Food Type",    value="Dry Kibble")
                extras["amount_grams"] = e2.number_input("Amount (g)", min_value=1, value=200)

            elif task_type == TaskType.WALK.value:
                extras["distance_km"] = st.number_input("Distance (km)", min_value=0.1,
                                                         value=1.0, step=0.1)

            elif task_type == TaskType.MEDICATION.value:
                e1, e2 = st.columns(2)
                extras["medication_name"] = e1.text_input("Medication Name")
                extras["dosage"]          = e2.text_input("Dosage")

            elif task_type == TaskType.APPOINTMENT.value:
                e1, e2 = st.columns(2)
                extras["vet_name"] = e1.text_input("Vet Name")
                extras["location"] = e2.text_input("Clinic / Location")

            submitted = st.form_submit_button("Schedule Task")
            if submitted:
                if not task_name.strip():
                    st.error("Task name is required.")
                else:
                    time_str  = due_time.strftime("%H:%M")
                    freq_enum = Frequency(frequency)
                    prio_enum = Priority[priority]
                    common = dict(
                        name=task_name.strip(),
                        task_type=TaskType(task_type),
                        due_date=due_date,
                        due_time=time_str,
                        pet_name=pet_choice,
                        owner_name=system.owner.name,
                        frequency=freq_enum,
                        priority=prio_enum,
                        duration_minutes=int(duration),
                        notes=notes,
                    )

                    if task_type == TaskType.FEEDING.value:
                        new_task = FeedingTask(**common, **extras)
                    elif task_type == TaskType.WALK.value:
                        new_task = WalkTask(**common, **extras)
                    elif task_type == TaskType.MEDICATION.value:
                        new_task = MedicationTask(**common, **extras)
                    else:
                        new_task = AppointmentTask(**common, **extras)

                    system.add_task(pet_choice, new_task)

                    # Immediate conflict check
                    task_conflicts = [
                        (a, b, r) for a, b, r in system.detect_conflicts()
                        if a.task_id == new_task.task_id
                        or b.task_id == new_task.task_id
                    ]
                    if task_conflicts:
                        st.warning(
                            "Task added, but a conflict was detected:\n"
                            + "\n".join(r for _, _, r in task_conflicts)
                        )
                    else:
                        st.success(
                            f"🎉 '{task_name}' scheduled for {pet_choice} "
                            f"on {due_date} at {time_str}!"
                        )


# ─────────────────────────────────────────────
# Page: Settings
# ─────────────────────────────────────────────

elif page == "⚙️ Settings":
    st.title("⚙️ Settings")

    with st.form("owner_form"):
        st.subheader("Owner Profile")
        new_name  = st.text_input("Name",  value=system.owner.name)
        new_email = st.text_input("Email", value=system.owner.email)
        new_phone = st.text_input("Phone", value=system.owner.phone)
        if st.form_submit_button("Save"):
            system.owner.name  = new_name
            system.owner.email = new_email
            system.owner.phone = new_phone
            st.success("Profile updated!")

    st.divider()
    st.subheader("🗑️ Reset Demo Data")
    st.caption("This will clear all pets and tasks and reload sample data.")
    if st.button("Reset to Demo Data", type="secondary"):
        del st.session_state["system"]
        st.rerun()

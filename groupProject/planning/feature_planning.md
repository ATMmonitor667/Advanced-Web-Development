# Feature Planning Guide

Use this document to help plan your features before adding them to the README.

## Feature Template

For each feature, consider:
- **Name:** What is it called?
- **Description:** What does it do?
- **User Benefit:** Why is it valuable?
- **Implementation:** How will you build it?
- **Type:** Baseline, Custom, or Stretch?

---

## Baseline Features Checklist

These are **REQUIRED** for all projects:

### Backend Requirements

- [ ] **One-to-Many Relationship**
  - Example: One user has many tasks
  - Tables: `users`, `tasks` (with `user_id` foreign key)

- [ ] **Many-to-Many Relationship with Join Table**
  - Example: Tasks have multiple tags, tags belong to multiple tasks
  - Tables: `tasks`, `tags`, `task_tags` (join table with `task_id` and `tag_id`)

- [ ] **RESTful API Routes**
  - [ ] GET `/api/[items]` - Get all items
  - [ ] GET `/api/[items]/:id` - Get single item
  - [ ] POST `/api/[items]` - Create new item
  - [ ] PATCH `/api/[items]/:id` - Update item
  - [ ] DELETE `/api/[items]/:id` - Delete item

- [ ] **Database Reset Functionality**
  - Script to reset database to default state

### Frontend Requirements

- [ ] **React Components**
  - [ ] Page components (CreatePage, ViewPage, etc.)
  - [ ] Reusable UI components (Card, Button, etc.)
  - [ ] Proper component hierarchy

- [ ] **React Router**
  - [ ] Dynamic routes (e.g., `/items/:id`)
  - [ ] Navigation between pages

- [ ] **User Interactions**
  - [ ] At least one same-page interaction (modal, dropdown, etc.)
  - [ ] At least one navigation to new page/URL

### Deployment

- [ ] **Render Deployment**
  - [ ] Backend deployed and working
  - [ ] Frontend deployed and working
  - [ ] All features functional in production

---

## Custom Features (Choose 2+)

### Option 1: Error Handling
- Graceful error messages for failed requests
- User-friendly error displays
- Fallback UI when things go wrong

### Option 2: Data Validation
- Validate form inputs before submission
- Check data constraints (e.g., date in future)
- Display validation errors to user

### Option 3: Filter/Sort
- Filter items by category, date, status, etc.
- Sort items by different criteria
- Multiple filter combinations

### Option 4: Auto-Generated Data
- Create default items for new users
- Generate starter data automatically
- Populate empty states with sample content

### Option 5: Modal/Slide-out
- Modal dialogs for confirmations
- Slide-out panels for details
- Overlay components without navigation

### Option 6: One-to-One Relationship
- User has one profile
- Order has one invoice
- Unique relationships in database

### Option 7: Custom Non-RESTful Route
- Special endpoint for complex operations
- Business logic that doesn't fit CRUD
- Custom data processing

---

## Stretch Features (Optional)

- [ ] **GitHub OAuth Login** - Authentication via GitHub
- [ ] **Loading Spinners** - Visual feedback during data loading
- [ ] **Image Upload** - Cloud storage for user images
- [ ] **Toast Notifications** - Pop-up feedback messages
- [ ] **Disabled Button States** - Prevent double-submission
- [ ] **Dynamic Restrictions** - Features based on user data

---

## Example: Student Task Manager

### Baseline Features

1. **View All Tasks** - Display list of all tasks with key info
2. **View Task Details** - Click task to see full details
3. **Create Task** - Form to add new task with title, due date, course
4. **Edit Task** - Update existing task information
5. **Delete Task** - Remove task from database
6. **Course Organization** - One-to-many: one course has many tasks
7. **Task Tags** - Many-to-many: tasks have multiple tags via join table

### Custom Features (choosing 2)

8. **Filter Tasks** - Filter by course, priority, or completion status
9. **Data Validation** - Validate due dates are in the future, required fields filled

### Stretch Features

10. **Points System** - Earn points for completing tasks on time
11. **Loading States** - Show spinner while tasks are loading
12. **Completion Animations** - Visual feedback when marking task complete

---

## Tips for Writing Features

✅ **Be specific** - "Create tasks" not just "Add items"

✅ **User-focused** - Describe what the user can do, not technical details

✅ **Measurable** - Each feature should be something you can demo

✅ **Realistic** - Can you build it in the available time?

✅ **Organized** - Group related features together

✅ **Complete** - Cover all CRUD operations for your main entity

# User Guide

This guide explains how to use the Task Management System for both Authors and Solvers.

## Getting Started

### Login

1. Open the application in your browser at `http://localhost:5173`
2. Enter your email and password
3. Click "Login"

**Test Accounts:**
- Author: `prof.vondrak@university.edu` / `seed1223`
- Solver: `tai.huy@student.edu` / `seed1223`

---

## For Authors

Authors create and manage tasks, assign them to Solvers, and approve or reject completed work.

### Dashboard Overview

After logging in as an Author, you'll see:
- **Create New Task** button
- **Filter** dropdown to view tasks by status
- **Task List** showing all your created tasks

### Creating a Task

1. Click "Create New Task"
2. Fill in the form:
   - **Title**: Brief description of the task
   - **Description**: Detailed instructions
   - **Assign to Solver**: Select who should work on this task
   - **Priority**: Low, Medium, or High
3. Click "Create Task"

The assigned Solver will receive a notification.

### Task Statuses

| Status | Meaning |
|--------|---------|
| **Pending** | Task created, waiting for Solver to start |
| **In Progress** | Solver is working on it |
| **Awaiting Approval** | Solver finished, needs your review |
| **Approved** | Work accepted, task complete |

### Reviewing Completed Tasks

When a task shows "Awaiting Approval":

1. Review the work
2. Click **Approve** if satisfactory
3. Click **Reject** if revisions needed

**Note:** Rejected tasks automatically return to "In Progress" status, and the Solver receives a notification to continue working.

### Deleting Tasks

Click the "Delete" button on any task to remove it. A confirmation dialog will appear.

---

## For Solvers

Solvers receive tasks from Authors, complete them, and submit for approval.

### Dashboard Overview

After logging in as a Solver, you'll see:
- **Filter** dropdown to view tasks by status
- **Task List** showing tasks assigned to you
- **Notifications** bell icon for updates

### Working on Tasks

1. Find a task with "Pending" status
2. Click "Start Working" to begin
3. Complete the work as described
4. Click "Mark Complete" when finished

### Task Flow

```
Pending → Start Working → In Progress → Mark Complete → Awaiting Approval
                                                              ↓
                                                        Author reviews
                                                        ↓           ↓
                                                   Approved    Rejected
                                                                   ↓
                                                            In Progress
                                                        (continue working)
```

### Notifications

Click the bell icon to see:
- New task assignments
- Approval notifications
- Rejection feedback

---

## Tips

1. **Check notifications regularly** to stay updated on task changes
2. **Use filters** to focus on tasks that need attention
3. **Refresh the page** if tasks seem outdated
4. **Provide clear descriptions** when creating tasks for better results

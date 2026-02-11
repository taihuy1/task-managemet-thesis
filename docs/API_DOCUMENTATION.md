# API Documentation

This document describes the REST API endpoints available in the Task Management System.

## Base URL

```
http://localhost:3001
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

---

## Auth Endpoints

### POST /auth/login

Authenticate a user and receive an access token.

**Request Body:**
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "user": {
            "id": "uuid",
            "email": "user@example.com",
            "name": "User Name",
            "role": "AUTHOR"
        }
    }
}
```

### POST /auth/register

Register a new user account.

**Request Body:**
```json
{
    "email": "user@example.com",
    "password": "password123",
    "name": "User Name",
    "role": "SOLVER"
}
```

**Response (201):**
```json
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "id": "uuid",
        "email": "user@example.com",
        "name": "User Name",
        "role": "SOLVER"
    }
}
```

### POST /auth/logout

Logout the current user (requires authentication).

**Response (200):**
```json
{
    "success": true,
    "message": "Logged out successfully"
}
```

---

## Task Endpoints

### GET /task

Get all tasks for the authenticated user. Authors see tasks they created, Solvers see tasks assigned to them.

**Response (200):**
```json
{
    "success": true,
    "data": [
        {
            "id": "uuid",
            "title": "Task Title",
            "description": "Task description",
            "status": "PENDING",
            "priority": "MEDIUM",
            "authorId": "uuid",
            "solverId": "uuid",
            "author": {
                "id": "uuid",
                "name": "Author Name",
                "email": "author@example.com"
            },
            "solver": {
                "id": "uuid",
                "name": "Solver Name",
                "email": "solver@example.com"
            },
            "createdAt": "2026-02-11T10:00:00.000Z",
            "updatedAt": "2026-02-11T10:00:00.000Z"
        }
    ]
}
```

### GET /task/:id

Get a single task by ID.

### POST /task

Create a new task (Author only).

**Request Body:**
```json
{
    "title": "Task Title",
    "desc": "Task description",
    "solvers": ["solver-uuid"],
    "priority": "MEDIUM"
}
```

### PUT /task/:id

Update a task's details.

**Request Body:**
```json
{
    "title": "Updated Title",
    "desc": "Updated description",
    "priority": "HIGH"
}
```

### DELETE /task/:id

Delete a task (Author only).

### PATCH /task/:id/start

Start working on a task (Solver only). Changes status from PENDING to STARTED.

### PATCH /task/:id/complete

Mark a task as complete (Solver only). Changes status from STARTED to COMPLETED.

### PATCH /task/:id/approve

Approve a completed task (Author only). Changes status from COMPLETED to APPROVED.

### PATCH /task/:id/reject

Reject a completed task (Author only). Changes status from COMPLETED back to STARTED so the solver can continue working.

**Request Body (optional):**
```json
{
    "reason": "Please fix the formatting issues"
}
```

---

## User Endpoints

### GET /users

Get all available solvers (for task assignment).

**Response (200):**
```json
{
    "success": true,
    "data": [
        {
            "id": "uuid",
            "email": "solver@example.com",
            "name": "Solver Name",
            "role": "SOLVER"
        }
    ]
}
```

---

## Notification Endpoints

### GET /notifications

Get all notifications for the authenticated user.

### PATCH /notifications/:id/read

Mark a notification as read.

---

## Task Status Flow

```
PENDING → STARTED → COMPLETED → APPROVED
                        ↓
                    (rejected)
                        ↓
                     STARTED (solver continues work)
```

## Error Responses

All errors follow this format:
```json
{
    "success": false,
    "message": "Error description",
    "errors": null,
    "timestamp": "2026-02-11T10:00:00.000Z"
}
```

Common HTTP status codes:
- 400: Bad Request (validation error)
- 401: Unauthorized (missing or invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Internal Server Error

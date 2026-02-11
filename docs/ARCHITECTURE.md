# Architecture Overview

This document describes the technical architecture of the Task Management System.

## System Overview

```
┌─────────────────┐     HTTP/REST      ┌─────────────────┐
│                 │ ←───────────────→  │                 │
│   React Client  │                    │   Express API   │
│   (Vite + TS)   │                    │   (Node.js)     │
│                 │                    │                 │
└─────────────────┘                    └────────┬────────┘
                                                │
                                                │ Prisma ORM
                                                │
                                       ┌────────▼────────┐
                                       │                 │
                                       │   PostgreSQL    │
                                       │                 │
                                       └─────────────────┘
```

## Technology Stack

### Frontend (client/)
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router 6** - Client-side routing
- **Axios** - HTTP client

### Backend (api/)
- **Node.js** - Runtime
- **Express 5** - Web framework
- **Prisma** - ORM and database toolkit
- **PostgreSQL** - Database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

---

## Frontend Architecture

### Directory Structure

```
client/src/
├── components/          # Reusable UI components
│   ├── Author/         # Author-specific components
│   ├── Solver/         # Solver-specific components
│   ├── Notifications/  # Notification components
│   └── Layout/         # Layout and routing components
│
├── pages/              # Page-level components (route targets)
│   ├── LoginPage.tsx
│   ├── AuthorDashboard.tsx
│   └── SolverDashboard.tsx
│
├── services/           # API communication layer
│   ├── api/           # HTTP service modules
│   └── storage/       # Local storage utilities
│
├── hooks/              # Custom React hooks
├── context/            # React Context providers
├── types/              # TypeScript type definitions
├── constants/          # Configuration and constants
└── utils/              # Utility functions
```

### Data Flow

```
User Action → Component → Hook → Service → API
                                    ↓
                              API Response
                                    ↓
                        Hook (updates state)
                                    ↓
                    Component (re-renders with new data)
```

### State Management

- **AuthContext**: User authentication state (token, user info)
- **useTasks hook**: Task data and operations
- **useNotifications hook**: Notification polling and state

---

## Backend Architecture

### Directory Structure

```
api/src/
├── config/             # Configuration modules
├── controllers/        # HTTP request handlers
├── services/           # Business logic
├── repositories/       # Database operations
├── middleware/         # Express middleware
├── routes/             # Route definitions
├── validators/         # Request validation schemas
└── utils/              # Utilities (errors, logging, etc.)
```

### Request Flow

```
HTTP Request
     ↓
  Middleware (auth, validation, logging)
     ↓
  Controller (handles HTTP specifics)
     ↓
  Service (business logic)
     ↓
  Repository (database operations)
     ↓
  Prisma → PostgreSQL
```

### Database Schema

```prisma
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  name         String
  password     String
  role         Role     @default(SOLVER)
  createdTasks Task[]   @relation("AuthorTasks")
  assignedTasks Task[]  @relation("SolverTasks")
  notifications Notification[]
}

model Task {
  id          String     @id @default(uuid())
  title       String
  description String
  status      TaskStatus @default(PENDING)
  priority    Priority   @default(MEDIUM)
  authorId    String
  solverId    String?
  author      User       @relation("AuthorTasks")
  solver      User?      @relation("SolverTasks")
}

model Notification {
  id        String   @id @default(uuid())
  userId    String
  taskId    String?
  message   String
  isRead    Boolean  @default(false)
  user      User     @relation(...)
  task      Task?    @relation(...)
}
```

---

## Task State Machine

```
                    ┌────────────┐
                    │  PENDING   │
                    └─────┬──────┘
                          │ start (Solver)
                          ▼
                    ┌────────────┐
          ┌────────│  STARTED   │◄───────┐
          │        └─────┬──────┘        │
          │              │ complete      │ reject (Author)
          │              ▼               │
          │        ┌────────────┐        │
          │        │ COMPLETED  │────────┘
          │        └─────┬──────┘
          │              │ approve (Author)
          │              ▼
          │        ┌────────────┐
          └───────►│  APPROVED  │
                   └────────────┘
```

---

## Security

1. **Authentication**: JWT tokens with expiration
2. **Authorization**: Role-based access control (Author/Solver)
3. **Password Security**: bcrypt hashing with salt rounds
4. **CORS**: Configured for specific origins
5. **Input Validation**: Joi schemas on all endpoints

---

## Deployment

The application can be deployed using Docker:

```bash
docker-compose up -d
```

Services:
- **api**: Node.js API server (port 3001)
- **client**: Nginx serving React build (port 80)
- **db**: PostgreSQL database (port 5432)

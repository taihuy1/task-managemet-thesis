# Development Guide

This document covers setting up the development environment and coding practices.

## Prerequisites

- **Node.js** 18.x or later
- **npm** 9.x or later
- **PostgreSQL** 14.x or connection to Prisma cloud database
- **Git**

---

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd THESIS
```

### 2. Install Dependencies

```bash
# Install API dependencies
cd api
npm install

# Install Client dependencies
cd ../client
npm install
```

### 3. Environment Setup

**API (api/.env):**
```env
DATABASE_URL=your-postgresql-connection-string
PORT=3001
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

**Client (client/.env.local):**
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_API_TIMEOUT=10000
```

### 4. Database Setup

```bash
cd api

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed test data
npm run db:seed
```

### 5. Start Development Servers

**Terminal 1 - API:**
```bash
cd api
npm run dev
```

**Terminal 2 - Client:**
```bash
cd client
npm run dev
```

The client will be available at `http://localhost:5173`

---

## Project Structure

```
THESIS/
├── api/                 # Backend Express API
│   ├── prisma/         # Database schema and migrations
│   ├── src/            # Source code
│   └── server.js       # Entry point
│
├── client/             # Frontend React application
│   ├── src/            # Source code
│   └── index.html      # HTML entry
│
├── docs/               # Documentation
│
└── docker-compose.yml  # Docker configuration
```

---

## Available Scripts

### API

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with test data |

### Client

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript checks |

---

## Code Style

### TypeScript

- Use explicit types for function parameters and return values
- Prefer interfaces over type aliases for object shapes
- Use enums for fixed sets of values

```typescript
// Good
interface Task {
    id: string;
    title: string;
    status: TaskStatus;
}

function getTask(id: string): Promise<Task> {
    // ...
}
```

### React Components

- Use functional components with hooks
- Keep components focused on single responsibility
- Extract reusable logic into custom hooks

```typescript
// Good
export default function TaskList({ tasks, onApprove }: TaskListProps) {
    return (
        <div>
            {tasks.map((task) => (
                <TaskItem key={task.id} task={task} onApprove={onApprove} />
            ))}
        </div>
    );
}
```

### API Services

- One service file per resource
- Use descriptive function names
- Handle errors at the hook level, not service level

```typescript
// Good - services/api/taskService.ts
export async function getTasks(): Promise<Task[]> {
    const response = await apiClient.get<ApiResponse<Task[]>>(API_ENDPOINTS.TASKS.BASE);
    return response.data.data;
}
```

---

## Debugging

### API Logs

The API uses Winston for logging. Check the console for:
- Request logs (method, path, status)
- Error details
- Database queries (in development)

### Client DevTools

1. Open browser DevTools (F12)
2. Check **Network** tab for API calls
3. Check **Console** for errors
4. Use React DevTools extension for component inspection

---

## Common Issues

### CORS Errors

Ensure `CORS_ORIGIN` in api/.env matches the client URL:
```env
CORS_ORIGIN=http://localhost:5173
```

### Database Connection

If you see database connection errors:
1. Verify `DATABASE_URL` is correct
2. Check PostgreSQL is running
3. Run `npm run prisma:generate` to regenerate client

### Type Errors

If you see TypeScript errors after changes:
```bash
cd client
npm run type-check
```

---

## Deployment

### Production Build

```bash
# Build client
cd client
npm run build

# The build output is in client/dist/
```

### Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

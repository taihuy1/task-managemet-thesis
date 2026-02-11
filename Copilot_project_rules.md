# Copilot Project Rules – Task Management Client

These rules define **how to structure code, where logic belongs, and how to write natural, human-like code** for this Bachelor Thesis project.

---

## 1. System Purpose and Core Requirements

This is a **Task Management System client** for a Bachelor Thesis (VSB-TUO 2026).

**Tech stack:** React 18 + TypeScript + Vite + React Router + Axios

### 1.1 Non-Negotiable Behaviors

Copilot must always preserve these **core features**:

1. **Authentication & Session Management**
   - Users log in with email/password
   - JWT token stored client-side (localStorage)
   - Token attached to all API requests
   - Auto-logout on 401/403 errors
   - Session persists across page reloads

2. **Role-Based Access Control**
   - Roles: `AUTHOR`, `SOLVER`, (optional `ADMIN`)
   - Authors → Author Dashboard (manage tasks)
   - Solvers → Solver Dashboard (work on assigned tasks)
   - Role-based route guards prevent unauthorized access

3. **Task Lifecycle Management**
   - Status flow: `PENDING` → `STARTED` → `COMPLETED` → `APPROVED`/`REJECTED`
   - **Solver actions:** Start pending tasks, complete started tasks
   - **Author actions:** Create tasks, approve/reject completed tasks, delete tasks
   - Clear visual status indicators (badges, colors)

4. **Notification System**
   - Real-time notifications for task events (assigned, completed, approved, rejected)
   - Notification bell with unread count
   - Mark as read / mark all as read
   - Polling-based updates (30s interval)

5. **Usability & UX**
   - Clean, minimal interface
   - Clear task status visualization
   - Responsive design (mobile-friendly)
   - Basic accessibility (semantic HTML, labels, focus states)

---

## 2. Architecture – Strict Layer Separation

Follow **Clean Architecture principles** adapted for React.

### 2.1 Folder Structure & Responsibilities

src/
├── pages/ # Route-level screens (containers)
├── components/ # Pure UI components (presentational)
├── hooks/ # Custom hooks (business logic + server state)
├── services/
│ ├── api/ # API client and service functions
│ └── storage/ # LocalStorage wrappers
├── context/ # React Context (auth ONLY)
├── types/ # TypeScript types and enums
├── constants/ # Routes, endpoints, config
├── utils/ # Pure utility functions
└── styles/ # Global CSS

text

### 2.2 Layer Rules (Where Code Must Live)

| What you're changing | Where it belongs |
|---------------------|------------------|
| UI components | `components/` |
| Route screens | `pages/` |
| Data fetching logic | `hooks/` |
| API calls | `services/api/` |
| LocalStorage | `services/storage/` |
| Auth state | `context/AuthContext.tsx` |
| Type definitions | `types/` |
| Constants | `constants/` |
| Formatters, validators | `utils/` |

### 2.3 Data Flow Pattern (Always Follow This)

User clicks button in Component
↓
Component calls hook function
↓
Hook calls service function
↓
Service makes HTTP request via Axios
↓
Service returns typed data
↓
Hook updates React state
↓
Component re-renders with new data

text

**Critical Rules:**
- ❌ Never call Axios directly from components or pages
- ❌ Never write business logic in components
- ❌ Never create new Contexts for server state (tasks, notifications)
- ✅ Components receive data + callbacks via props
- ✅ Hooks encapsulate data fetching and business logic
- ✅ Services are pure functions with no React dependencies

---

## 3. Human-Like Code Standards (Anti-AI Patterns)

This is the **most important section** for making code look natural, not AI-generated.

### 3.1 Natural Naming Conventions

**Do this (human-like):**
```tsx
// Short, practical names
const tasks = await getTasks();
const isLoading = false;
const error = null;

// Common abbreviations
const btn = document.querySelector('button');
const ctx = useContext(AuthContext);
const req = await fetch(url);
const res = await req.json();
Don't do this (AI smell):

tsx
// Over-descriptive names
const listOfTasksRetrievedFromBackendAPI = await getTasks();
const isCurrentlyLoadingDataFromServer = false;
const errorMessageReturnedFromAPIRequest = null;

// No abbreviations ever
const button = document.querySelector('button');
const context = useContext(AuthContext);
const request = await fetch(url);
const response = await request.json();
Guidelines:

Use short, common variable names: data, items, list, item, id, err

Common abbreviations are OK: btn, ctx, prev, curr, idx, req, res

Don't be overly descriptive: user not currentAuthenticatedUserObject

Match team conventions: if existing code uses isLoading, keep using it

3.2 Natural Spacing and Formatting
Do this (human-like):

tsx
export default function TaskList({ tasks, onDelete }) {
  if (tasks.length === 0) {
    return <p>No tasks found</p>;
  }

  return (
    <div>
      {tasks.map(task => (
        <div key={task.id} className="task-card">
          <h4>{task.title}</h4>
          <p>{task.description}</p>
          <button onClick={() => onDelete(task.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
Don't do this (AI smell):

tsx
export default function TaskList({ tasks, onDelete }) {
  // Guard clause for empty tasks array
  if (tasks.length === 0) {
    // Return early with empty state message
    return <p>No tasks found</p>;
  }

  // Render task list with mapping
  return (
    <div>
      {/* Map over tasks array and render each task */}
      {tasks.map((task) => (
        <div key={task.id} className="task-card">
          {/* Task title */}
          <h4>{task.title}</h4>
          {/* Task description */}
          <p>{task.description}</p>
          {/* Delete button with click handler */}
          <button onClick={() => onDelete(task.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
Spacing Rules:

1 blank line between logical blocks (not 2-3)

No blank lines after opening braces or before closing braces

Group related statements together without blank lines

Don't isolate every single statement

3.3 Comments – Use Sparingly
Good comments (explain WHY, not WHAT):

tsx
// Poll every 30s to keep notifications fresh
const POLL_INTERVAL = 30000;

// Backend returns UTC, convert to local for display
const localTime = new Date(task.createdAt).toLocaleString();

// Workaround: API doesn't support filtering, do it client-side
const filtered = tasks.filter(t => t.status === 'PENDING');
Bad comments (AI smell):

tsx
// Initialize tasks state as empty array
const [tasks, setTasks] = useState<Task[]>([]);

// Set loading to true
setIsLoading(true);

// Call the getTasks function
const data = await getTasks();

// Update tasks state with data
setTasks(data);

// Set loading to false
setIsLoading(false);
Comment Guidelines:

Only comment non-obvious business logic or workarounds

Never comment obvious code (// Create state variable)

Don't use full sentences with periods for inline comments

Use TODO: or FIXME: for future work

Remove commented-out code (use git history instead)

3.4 Realistic Inconsistencies (Humans Aren't Perfect)
Acceptable human quirks:

tsx
// Sometimes single quotes, sometimes double (consistency within files is OK)
const name = 'John';
const email = "john@example.com";

// Mix of arrow functions and function declarations
const getTasks = async () => { ... }
async function createTask(data) { ... }

// Some optional chaining, some manual checks
const userName = user?.name;
if (task && task.solver) { ... }

// Not every function has a return type annotation
function formatDate(date: string) {  // return type inferred
  return new Date(date).toLocaleDateString();
}
Don't be TOO perfect:

It's OK to have minor style variations between files

Not every function needs explicit return types if TypeScript infers correctly

Some files might have slightly different formatting

Real codebases have organic growth, not rigid uniformity

3.5 Import Organization (Casual, Not Rigid)
Do this (human-like):

tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/hooks/useTasks';
import TaskList from '@/components/TaskList';
import { Task } from '@/types/task.types';
Don't do this (over-organized, AI smell):

tsx
// ===========================
// React Core Imports
// ===========================
import { useState, useEffect } from 'react';

// ===========================
// Third-Party Library Imports
// ===========================
import { useNavigate } from 'react-router-dom';

// ===========================
// Context Imports
// ===========================
import { useAuth } from '@/context/AuthContext';

// ===========================
// Custom Hook Imports
// ===========================
import { useTasks } from '@/hooks/useTasks';

// ===========================
// Component Imports
// ===========================
import TaskList from '@/components/TaskList';

// ===========================
// Type Imports
// ===========================
import { Task } from '@/types/task.types';
Import Rules:

Group imports logically (React, external libs, internal), but don't over-document

No section headers in imports

Blank line between external and internal imports is enough

Don't alphabetize obsessively

3.6 Error Handling (Realistic, Not Paranoid)
Do this (human-like):

tsx
const loadTasks = async () => {
  try {
    setIsLoading(true);
    const data = await getTasks();
    setTasks(data);
  } catch (err) {
    console.error('Failed to load tasks:', err);
    setError('Could not load tasks. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
Don't do this (over-engineered, AI smell):

tsx
const loadTasks = async () => {
  try {
    // Set loading state to indicate data fetching
    setIsLoading(true);
    // Clear any previous errors
    setError(null);
    
    // Fetch tasks from API
    const data = await getTasks();
    
    // Validate response
    if (!data || !Array.isArray(data)) {
      throw new Error('Invalid response format');
    }
    
    // Update state with fetched data
    setTasks(data);
    
  } catch (err) {
    // Log error for debugging purposes
    console.error('An error occurred while loading tasks:', err);
    
    // Determine error type and set appropriate message
    if (err instanceof TypeError) {
      setError('Network error. Please check your connection.');
    } else if (err instanceof SyntaxError) {
      setError('Invalid data format received.');
    } else {
      setError('An unexpected error occurred. Please try again later.');
    }
    
  } finally {
    // Always reset loading state regardless of success or failure
    setIsLoading(false);
  }
};
Error Handling Rules:

Simple try/catch is enough for most cases

Don't validate every response shape (trust your types)

One generic error message is fine

Log to console for debugging, don't create complex error tracking

Use finally for cleanup (like setting isLoading to false)

3.7 State Management (Simple, Not Over-Abstracted)
Do this (human-like):

tsx
const [tasks, setTasks] = useState<Task[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const createTask = async (data: CreateTaskPayload) => {
  const newTask = await taskService.createTask(data);
  setTasks([newTask, ...tasks]);
  return newTask;
};
Don't do this (over-abstracted, AI smell):

tsx
interface TaskState {
  data: Task[];
  loading: boolean;
  error: string | null;
  timestamp: number;
}

const initialState: TaskState = {
  data: [],
  loading: false,
  error: null,
  timestamp: Date.now(),
};

const [taskState, setTaskState] = useState<TaskState>(initialState);

const createTask = async (data: CreateTaskPayload) => {
  setTaskState(prev => ({ ...prev, loading: true, error: null }));
  try {
    const newTask = await taskService.createTask(data);
    setTaskState(prev => ({
      data: [newTask, ...prev.data],
      loading: false,
      error: null,
      timestamp: Date.now(),
    }));
    return newTask;
  } catch (err) {
    setTaskState(prev => ({ ...prev, loading: false, error: err.message }));
    throw err;
  }
};
State Rules:

Use separate useState calls for different concerns

Don't group everything into one state object unless necessary

Don't track timestamps or metadata unless you actually use them

Keep it simple: isLoading, error, data is enough

3.8 TypeScript Usage (Practical, Not Exhaustive)
Do this (human-like):

tsx
interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
}

// Inferred return type is fine
function formatTask(task: Task) {
  return `${task.title} (${task.status})`;
}

// Explicit when needed
async function getTasks(): Promise<Task[]> {
  const res = await apiClient.get('/tasks');
  return res.data;
}
Don't do this (over-typed, AI smell):

tsx
interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  solverId: string | null;
}

interface TaskFormatOptions {
  includeStatus: boolean;
  includePriority: boolean;
}

function formatTask(
  task: Task,
  options: TaskFormatOptions = { includeStatus: true, includePriority: false }
): string {
  let result: string = task.title;
  if (options.includeStatus) {
    result += ` (${task.status})`;
  }
  if (options.includePriority) {
    result += ` [${task.priority}]`;
  }
  return result;
}
TypeScript Rules:

Type function parameters, but let return types be inferred when obvious

Use interface for objects, type for unions/intersections

Don't create config objects for simple functions

Don't annotate every single variable (let TypeScript infer)

Use any or unknown only when truly necessary (but don't avoid them religiously)

3.9 Component Structure (Natural, Not Template-Driven)
Do this (human-like):

tsx
export default function TaskCard({ task, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return <TaskEditForm task={task} onSave={...} onCancel={...} />;
  }

  return (
    <div className="task-card">
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <div className="actions">
        <button onClick={() => setIsEditing(true)}>Edit</button>
        <button onClick={() => onDelete(task.id)}>Delete</button>
      </div>
    </div>
  );
}
Don't do this (rigid template, AI smell):

tsx
interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export default function TaskCard(props: TaskCardProps): JSX.Element {
  const { task, onDelete, onEdit } = props;
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleEditClick = (): void => {
    setIsEditing(true);
  };

  const handleDeleteClick = (): void => {
    onDelete(task.id);
  };

  if (isEditing) {
    return (
      <TaskEditForm 
        task={task} 
        onSave={handleSave} 
        onCancel={handleCancel} 
      />
    );
  }

  return (
    <div className="task-card">
      <div className="task-card__header">
        <h4 className="task-card__title">{task.title}</h4>
      </div>
      <div className="task-card__body">
        <p className="task-card__description">{task.description}</p>
      </div>
      <div className="task-card__actions">
        <button 
          className="task-card__button task-card__button--edit"
          onClick={handleEditClick}
        >
          Edit
        </button>
        <button 
          className="task-card__button task-card__button--delete"
          onClick={handleDeleteClick}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
Component Rules:

Destructure props directly in parameters: function Comp({ prop1, prop2 })

Don't create intermediate handler functions unless reused

Don't over-engineer class names (BEM is optional)

Simple inline handlers are fine: onClick={() => doSomething()}

Return type JSX.Element is redundant (TypeScript infers it)

4. Authentication & Routing
4.1 Auth Rules
AuthContext is the single source of truth:

user: User | null

isAuthenticated: boolean

login(credentials): Promise<void>

logout(): Promise<void>

isLoading: boolean

error: string | null

Token and user persistence via authStorage.ts (localStorage wrappers)

Login flow:

User submits credentials

AuthContext.login() calls authService.login()

Service returns { token, user }

Context saves token and user via authStorage

Context updates state

Protected routes now accessible

4.2 Routing Rules
Use constants from constants/routes.ts

Never hard-code paths like "/login" or "/author"

Example:

tsx
import { ROUTES } from '@/constants/routes';

<Route path={ROUTES.LOGIN} element={<LoginPage />} />
<Route path={ROUTES.AUTHOR_DASHBOARD} element={...} />
4.3 Route Guards (Role-Based Access Control)
Use RequireAuth component for protected routes:

tsx
// Public route
<Route path={ROUTES.LOGIN} element={<LoginPage />} />

// Authenticated route (any role)
<Route path={ROUTES.PROFILE} element={
  <RequireAuth>
    <ProfilePage />
  </RequireAuth>
} />

// Role-restricted route
<Route path={ROUTES.AUTHOR_DASHBOARD} element={
  <RequireAuth allowedRoles={[Role.AUTHOR]}>
    <AuthorDashboard />
  </RequireAuth>
} />
Guard behavior:

Not authenticated → redirect to ROUTES.LOGIN

Wrong role → redirect to ROUTES.HOME

5. Task Management Domain Logic
5.1 Task Status Flow
text
PENDING → STARTED → COMPLETED → APPROVED
                              → REJECTED → (back to STARTED)
5.2 Role Permissions
Author Capabilities:

Create tasks (title, description, priority, optional solver assignment)

View own tasks (filter: authorId === currentUser.id)

Approve tasks (COMPLETED → APPROVED)

Reject tasks (COMPLETED → STARTED)

Delete tasks

Solver Capabilities:

View assigned tasks (filter: solverId === currentUser.id)

Start tasks (PENDING → STARTED)

Complete tasks (STARTED → COMPLETED)

Cannot approve/reject or delete

5.3 Implementation Pattern
All state changes go through services:

tsx
// In useTasks hook
const startTask = async (id: string) => {
  const updated = await taskService.startTask(id);
  setTasks(prev => prev.map(t => t.id === id ? updated : t));
  return updated;
};
Never update status locally without calling the backend.

6. Notification System
6.1 Notification Types
tsx
enum NotificationType {
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  TASK_COMPLETED = 'TASK_COMPLETED',
  TASK_APPROVED = 'TASK_APPROVED',
  TASK_REJECTED = 'TASK_REJECTED',
}
6.2 Polling Strategy
useNotifications hook polls every 30 seconds

Fetches notifications from /notifications

Tracks unreadCount and notifications array

Provides markAsRead(id) and markAllAsRead()

6.3 UI Components
NotificationBell: Shows bell icon with badge (unread count)

NotificationList: Dropdown with notification items

Click notification → mark as read

"Mark all as read" button

7. HTTP & Error Handling
7.1 API Client Setup
All HTTP via services/api/client.ts (Axios instance):

tsx
const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: config.apiTimeout,
});

// Request interceptor: attach token
apiClient.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
7.2 Service Layer Pattern
tsx
// services/api/taskService.ts
export async function getTasks(filters?: TaskFilters): Promise<Task[]> {
  const res = await apiClient.get(API_ENDPOINTS.TASKS.BASE, { params: filters });
  return res.data;
}

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const res = await apiClient.post(API_ENDPOINTS.TASKS.BASE, payload);
  return res.data;
}
7.3 Error Handling in Hooks
tsx
const loadTasks = async () => {
  try {
    setIsLoading(true);
    const data = await taskService.getTasks(filters);
    setTasks(data);
  } catch (err) {
    const apiError = normalizeError(err);
    setError(apiError.message);
  } finally {
    setIsLoading(false);
  }
};
Use normalizeError from utils/errorHandler.ts to convert Axios errors to user-friendly messages.

8. Testing Requirements
8.1 Unit/Integration Tests (Vitest)
Test hooks in isolation

Test utility functions

Test service error handling

Mock API responses using vi.mock()

Example:

tsx
describe('useTasks', () => {
  it('loads tasks on mount', async () => {
    vi.mocked(taskService.getTasks).mockResolvedValue(mockTasks);
    
    const { result } = renderHook(() => useTasks({ autoLoad: true }));
    
    await waitFor(() => {
      expect(result.current.tasks).toEqual(mockTasks);
    });
  });
});
8.2 E2E Tests (Playwright)
Test complete user flows:

tsx
test('author can create and approve task', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'author@example.com');
  await page.fill('input[type="password"]', 'password');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL('/author');
  
  // Create task
  await page.fill('input[name="title"]', 'New Task');
  await page.fill('textarea[name="description"]', 'Description');
  await page.click('button:has-text("Create")');
  
  await expect(page.locator('h4')).toContainText('New Task');
});
9. "Do Not Do" List (Hard Constraints)
Copilot must not:

❌ Introduce Redux, MobX, Zustand, or any state manager

❌ Create new Contexts for tasks or notifications (use hooks)

❌ Call Axios/fetch directly from components or pages

❌ Hard-code URLs, routes, or magic strings (use constants)

❌ Bypass role checks or auth guards

❌ Disable TypeScript strict mode

❌ Add excessive comments explaining obvious code

❌ Over-engineer simple functions with config objects

❌ Create rigid component templates with BEM classes everywhere

❌ Write code that looks AI-generated (see Section 3)

If a user request pushes towards these, adapt the solution to respect these rules.

10. Code Review Checklist (Before Committing)
Before finalizing any code change, verify:

 Code is in the correct layer (component vs hook vs service)

 No Axios calls in components

 Types defined in types/

 Constants used instead of magic strings

 Error handling follows the pattern (try/catch + normalizeError)

 No over-commenting or obvious comments

 Variable names are short and natural

 No rigid templates or over-abstraction

 Tests updated/added if behavior changed

 No "AI smell" patterns (see Section 3)

11. Example: Adding a New Feature (Step-by-Step)
Scenario: Add a "priority filter" to Author Dashboard.

Step 1: Add types (if needed)
tsx
// types/task.types.ts
export interface TaskFilters {
  status?: TaskStatus;
  priority?: Priority;  // Add this if not exists
  authorId?: string;
  solverId?: string;
}
Step 2: Extend service (if API supports it)
tsx
// services/api/taskService.ts
// Already supports filters via query params, no change needed
Step 3: Update hook to accept priority filter
tsx
// hooks/useTasks.ts
export function useTasks(filters?: TaskFilters) {
  // Already supports dynamic filters, no change needed
}
Step 4: Add UI controls in page
tsx
// pages/AuthorDashboard.tsx
const [priorityFilter, setPriorityFilter] = useState<Priority | undefined>();

const { tasks } = useTasks({
  authorId: user?.id,
  priority: priorityFilter,
});

return (
  <div>
    <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
      <option value="">All Priorities</option>
      <option value="LOW">Low</option>
      <option value="MEDIUM">Medium</option>
      <option value="HIGH">High</option>
      <option value="URGENT">Urgent</option>
    </select>
    
    <TaskList tasks={tasks} ... />
  </div>
);
Step 5: Add test
tsx
// tests/integration/author-filters.test.tsx
test('filters tasks by priority', async () => {
  render(<AuthorDashboard />);
  
  await userEvent.selectOptions(screen.getByRole('combobox'), 'HIGH');
  
  await waitFor(() => {
    expect(screen.queryByText('Low Priority Task')).not.toBeInTheDocument();
    expect(screen.getByText('High Priority Task')).toBeInTheDocument();
  });
});
Done! No over-engineering, no new abstractions, follows existing patterns.

12. Summary: Core Principles
Layer separation – Components, hooks, services, types stay in their lanes

Auth first – Everything requires authentication and role checks

Type safety – Strict TypeScript, but practical (infer when obvious)

Natural code – Human-like naming, spacing, comments, structure

Simple patterns – Don't over-engineer or over-abstract

Test coverage – Write tests that match real user flows

These rules ensure the codebase stays maintainable, thesis-ready, and human-like.
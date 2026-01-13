# Task Management System

Thesis project - Task management system with author and solver roles.

## How to Run and Test

### Step 1: Database Setup

Run the SQL script `database/setup.sql` in SQL Server Management Studio. This creates the database and sample data.

### Step 2: Backend Setup

Create a file `api/.env` with your database credentials:

```
DB_SERVER=localhost
DB_PORT=1433
DB_USER=sa
DB_PASS=your_password_here
DB_NAME=TaskManagerDB
PORT=3001
JWT_SECRET=any_random_string
CORS_ORIGIN=http://localhost:3000
```

Then install and run:
```bash
cd api
npm install
npm start
```

You should see: "Server running on port 3001" and "Database connected"

### Step 3: Frontend Setup

Open a new terminal and run:
```bash
cd web
npm install
npm start
```

This opens the browser at `http://localhost:3000`

### Step 4: Test the Application

**Login with test accounts:**

Author accounts (can create and manage tasks):
- Username: `prof_vondrak` / Password: `123`
- Username: `manager_smith` / Password: `123`

Solver accounts (can work on assigned tasks):
- Username: `student_tai` / Password: `123`
- Username: `student_anna` / Password: `123`
- Username: `student_pavel` / Password: `123`
- Username: `student_lucie` / Password: `123`

**Testing workflow:**
1. Login as an author (e.g., `prof_vondrak`)
2. Create a new task and assign it to a solver
3. Logout and login as the assigned solver
4. Start the task, then mark it as completed
5. Logout and login back as the author
6. Approve or reject the completed task

All actions (GET, POST, PUT, DELETE) should work correctly now.





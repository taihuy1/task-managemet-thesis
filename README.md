# Task Management System

Thesis project - Task management system with author and solver roles.

## Quick Start (Recommended)

This setup uses Docker to automatically start a SQL Server database, making it easy to run the application without manual database installation.

### Prerequisites
- Docker and Docker Compose installed
- Node.js (v14 or higher)
- npm

### Step 1: Start the Database

```bash
# Start SQL Server in Docker (downloads and initializes automatically)
docker compose up -d

# Wait 30 seconds for database initialization to complete
```

The database will be automatically created with sample data (6 users and 7 tasks).

### Step 2: Start the Backend

```bash
cd api
npm install
npm start
```

You should see: "Server running on port 3001" and "Database connected"

### Step 3: Start the Frontend

Open a new terminal:
```bash
cd web
npm install
npm start
```

The browser will automatically open at `http://localhost:3000`

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

## Manual Database Setup (Alternative)

If you prefer to use an existing SQL Server instance instead of Docker:

1. Run the SQL script `database/setup.sql` in SQL Server Management Studio
2. Update `api/.env` with your database credentials:
   ```
   DB_SERVER=your_server
   DB_PORT=1433
   DB_USER=your_username
   DB_PASS=your_password
   DB_NAME=TaskManagerDB
   PORT=3001
   JWT_SECRET=any_random_string
   CORS_ORIGIN=http://localhost:3000
   ```
3. Follow steps 2-4 from Quick Start

## Stopping the Application

```bash
# Stop the Docker database
docker compose down

# Remove database data (fresh start next time)
docker compose down -v
```

## Troubleshooting

**Network Error on Login:**
- Ensure Docker container is running: `docker compose ps`
- Check backend is connected to database in server logs
- Verify backend is running on port 3001

**Database Connection Failed:**
- Wait 30-40 seconds after `docker compose up -d` for initialization
- Check logs: `docker logs taskmanager-sqlserver`
- Restart: `docker compose down -v && docker compose up -d`





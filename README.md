# Task Management System

Hi professor, this is my thesis project. The database is not included in the GitHub repository, so you need to set it up on your computer first.

## Setup Database

1. Open SQL Server Management Studio (SSMS)

2. Connect to your SQL Server

3. Create the database:
   ```sql
   CREATE DATABASE TaskManagerDB;
   GO
   ```

4. Run the `database/setup.sql` file to create tables

5. (Optional) Run `database/Data.sql` for test data

## Configure Backend

1. In the `api` folder, create a file named `.env`

2. Add this to `.env`:
   ```
   DB_SERVER=localhost
   DB_PORT=1433
   DB_USER=sa
   DB_PASS=your_sql_password
   DB_NAME=TaskManagerDB
   ```
   
   Replace `your_sql_password` with your actual SQL Server password.

## Install and Run

**Backend:**
```
cd api
npm install
npm install jsonwebtoken
node server.js
```

**Frontend (new terminal):**
```
cd web
npm install
npm start
```

Then open browser to `http://localhost:3000`

## Test Login

**Authors:**
- Username: `prof_vondrak`, Password: `123` (Ivo Vondrak)
- Username: `manager_smith`, Password: `123` (John Smith)

**Solvers:**
- Username: `student_tai`, Password: `123` (Huy Tai Le)
- Username: `student_anna`, Password: `123` (Anna Novak)
- Username: `student_pavel`, Password: `123` (Pavel Svoboda)
- Username: `student_lucie`, Password: `123` (Lucie Dvorak)

## Testing Side-by-Side Sessions

To test notifications and interactions between authors and solvers:

1. Open two browser windows (or use incognito mode for one)
2. In first window: Login as an author (e.g., `prof_vondrak`)
3. In second window: Login as a solver (e.g., `student_tai`)
4. Arrange windows side by side

**Test Scenarios:**
- Author creates a task → Solver should see it after clicking Refresh
- Author assigns task to solver → Solver gets notification
- Solver starts/completes task → Author sees status update after refresh
- Author approves/rejects task → Solver gets notification

Use the Refresh button to update tasks and notifications in both windows.

## If Database Connection Fails

- Check SQL Server is running
- Verify username/password in `.env` file
- Make sure database name is `TaskManagerDB`

# Task Management System

Hi professor, this is my thesis project. First we need to setup the database connection on your computer
## Setup Database

1. Open SQL Server Management Studio (SSMS)

2. Connect to your SQL Server

3. Create the database:
   ```sql
   CREATE DATABASE TaskManagerDB;
   GO
   ```

4. Run the `database/setup.sql` file to create tables

## Configure Backend

1. In the `api` folder, create a file named `.env`

2. Add this to `.env` ( this file is for future development if i decided i want to continue to improving it and deploy in the future) :
   ```
   DB_SERVER=localhost
   DB_PORT=1433
   DB_USER=sa
   DB_PASS=password
   DB_NAME=TaskManagerDB
   ```
   
   Replace `password` with your actual SQL Server password.

## Install and Run

**Backend:**
```
cd api
npm install
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

- Username: `prof_vondrak`, Password: `123` (Author)
- Username: `student_tai`, Password: `123` (Solver)

## If Database Connection Fails

- Check SQL Server is running
- Verify username/password in `.env` file
- Make sure database name is `TaskManagerDB`

Please let me know if you have any problems.

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { connectDB, sql } = require('./db');
require('dotenv').config();

const app = express();
const PORT = 3001;
let db;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, 'your_secret_key', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}

app.post('/auth/login', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        if (!username || !password) {
            return res.status(400).json({ message: 'Missing username or password' });
        }

        if (!db) {
            return res.status(500).json({ message: 'Database not connected' });
        }

        const result = await db.request()
            .input('username', sql.NVarChar, username)
            .query('SELECT * FROM Users WHERE Username = @username');

        const user = result.recordset[0];

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (password !== user.Password) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign(
            { id: user.UserID, role: user.UserRole },
            'your_secret_key',
            { expiresIn: '1h' }
        );

        res.json({
            accessToken: token,
            user: {
                id: user.UserID,
                username: user.Username,
                role: user.UserRole
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/auth/register', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const role = req.body.role;

        if (!username || !password || !role) {
            return res.status(400).json({ message: 'Missing username, password, or role' });
        }
        
        if (!db) {
            return res.status(500).json({ message: 'Database not connected' });
        }

        await db.request()
            .input('username', sql.NVarChar, username)
            .input('password', sql.NVarChar, password)
            .input('role', sql.NVarChar, role)
            .query('INSERT INTO Users (Username, Password, UserRole) VALUES (@username, @password, @role)');
        
        res.json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/auth/logout', authenticateToken, (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

app.get('/users/solvers', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'author') {
            return res.status(403).json({ message: 'Only authors can view solvers' });
        }

        if (!db) {
            return res.status(500).json({ message: 'Database not connected' });
        }

        const result = await db.request()
            .query('SELECT UserID, Username, FullName FROM Users WHERE UserRole = \'solver\' ORDER BY FullName');

        res.json(result.recordset);

    } catch (error) {
        console.error('Get solvers error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/task/', authenticateToken, async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ message: 'Database not connected' });
        }

        const userId = req.user.id;
        const userRole = req.user.role;

        let query;
        if (userRole === 'author') {
            query = 'SELECT * FROM Tasks WHERE AuthorID = @userId ORDER BY CreatedAt DESC';
        } else {
            query = 'SELECT * FROM Tasks WHERE SolverID = @userId ORDER BY CreatedAt DESC';
        }

        const result = await db.request()
            .input('userId', sql.Int, userId)
            .query(query);

        res.json(result.recordset);

    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/task/:id', authenticateToken, async (req, res) => {
    try {
        const taskId = req.params.id;

        if (!db) {
            return res.status(500).json({ message: 'Database not connected' });
        }

        const result = await db.request()
            .input('taskId', sql.Int, taskId)
            .query('SELECT * FROM Tasks WHERE TaskID = @taskId');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(result.recordset[0]);

    } catch (error) {
        console.error('Get task error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/task/', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'author') {
            return res.status(403).json({ message: 'Only authors can create tasks' });
        }

        const { title, desc, solvers } = req.body;

        if (!title || !desc) {
            return res.status(400).json({ message: 'Title and description are required' });
        }

        if (!solvers || !Array.isArray(solvers) || solvers.length === 0) {
            return res.status(400).json({ message: 'Task must be assigned to a solver' });
        }

        if (!db) {
            return res.status(500).json({ message: 'Database not connected' });
        }

        const solverId = solvers[0];

        const solverCheck = await db.request()
            .input('solverId', sql.Int, solverId)
            .query('SELECT UserID FROM Users WHERE UserID = @solverId AND UserRole = \'solver\'');

        if (solverCheck.recordset.length === 0) {
            return res.status(400).json({ message: 'Invalid solver ID' });
        }

        const result = await db.request()
            .input('title', sql.NVarChar, title)
            .input('description', sql.NVarChar, desc)
            .input('authorId', sql.Int, req.user.id)
            .input('solverId', sql.Int, solverId)
            .query(`INSERT INTO Tasks (Title, Description, AuthorID, SolverID, TaskStatus) 
                    OUTPUT INSERTED.* 
                    VALUES (@title, @description, @authorId, @solverId, 'waiting')`);

        const newTask = result.recordset[0];

        await db.request()
            .input('userId', sql.Int, solverId)
            .input('taskId', sql.Int, newTask.TaskID)
            .input('message', sql.NVarChar, `You have been assigned a new task: ${title}`)
            .query('INSERT INTO Notifications (UserID, TaskID, Message) VALUES (@userId, @taskId, @message)');

        res.status(201).json(newTask);

    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/task/:id', authenticateToken, async (req, res) => {
    try {
        const taskId = req.params.id;
        const { title, desc, status, solverId } = req.body;

        if (!db) {
            return res.status(500).json({ message: 'Database not connected' });
        }

        const checkResult = await db.request()
            .input('taskId', sql.Int, taskId)
            .query('SELECT * FROM Tasks WHERE TaskID = @taskId');

        if (checkResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        let updates = [];
        if (title) updates.push('Title = @title');
        if (desc) updates.push('Description = @description');
        if (status) updates.push('TaskStatus = @status');
        if (solverId) updates.push('SolverID = @solverId');

        if (updates.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        const query = `UPDATE Tasks SET ${updates.join(', ')} 
                       OUTPUT INSERTED.* 
                       WHERE TaskID = @taskId`;

        const request = db.request()
            .input('taskId', sql.Int, taskId);
        
        if (title) request.input('title', sql.NVarChar, title);
        if (desc) request.input('description', sql.NVarChar, desc);
        if (status) request.input('status', sql.NVarChar, status);
        if (solverId) request.input('solverId', sql.Int, solverId);

        const result = await request.query(query);
        res.json(result.recordset[0]);

    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/task/:id', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'author') {
            return res.status(403).json({ message: 'Only authors can delete tasks' });
        }

        const taskId = req.params.id;

        if (!db) {
            return res.status(500).json({ message: 'Database not connected' });
        }

        const checkResult = await db.request()
            .input('taskId', sql.Int, taskId)
            .input('authorId', sql.Int, req.user.id)
            .query('SELECT * FROM Tasks WHERE TaskID = @taskId AND AuthorID = @authorId');

        if (checkResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await db.request()
            .input('taskId', sql.Int, taskId)
            .query('DELETE FROM Notifications WHERE TaskID = @taskId');

        await db.request()
            .input('taskId', sql.Int, taskId)
            .query('DELETE FROM Tasks WHERE TaskID = @taskId');

        res.json({ message: 'Task deleted successfully' });

    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

app.post('/request/send', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'author') {
            return res.status(403).json({ message: 'Only authors can assign tasks' });
        }

        const { taskId, solvers } = req.body;

        if (!taskId || !solvers || !Array.isArray(solvers)) {
            return res.status(400).json({ message: 'Task ID and solvers array required' });
        }

        if (!db) {
            return res.status(500).json({ message: 'Database not connected' });
        }

        const taskResult = await db.request()
            .input('taskId', sql.Int, taskId)
            .query('SELECT * FROM Tasks WHERE TaskID = @taskId');

        if (taskResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const task = taskResult.recordset[0];

        await db.request()
            .input('taskId', sql.Int, taskId)
            .input('solverId', sql.Int, solvers[0])
            .query('UPDATE Tasks SET SolverID = @solverId, TaskStatus = \'waiting\' WHERE TaskID = @taskId');

        await db.request()
            .input('userId', sql.Int, solvers[0])
            .input('taskId', sql.Int, taskId)
            .input('message', sql.NVarChar, `You have been assigned a new task: ${task.Title}`)
            .query('INSERT INTO Notifications (UserID, TaskID, Message) VALUES (@userId, @taskId, @message)');

        res.json({ message: 'Task assigned successfully' });

    } catch (error) {
        console.error('Send task error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/request/rely/start', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'solver') {
            return res.status(403).json({ message: 'Only solvers can start tasks' });
        }

        const { taskId } = req.body;

        if (!taskId) {
            return res.status(400).json({ message: 'Task ID required' });
        }

        if (!db) {
            return res.status(500).json({ message: 'Database not connected' });
        }

        const checkResult = await db.request()
            .input('taskId', sql.Int, taskId)
            .input('solverId', sql.Int, req.user.id)
            .query('SELECT * FROM Tasks WHERE TaskID = @taskId AND SolverID = @solverId');

        if (checkResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Task not found or not assigned to you' });
        }

        const task = checkResult.recordset[0];
        if (task.TaskStatus !== 'waiting') {
            return res.status(400).json({ message: `Task status must be 'waiting' to start. Current status: ${task.TaskStatus}` });
        }

        const result = await db.request()
            .input('taskId', sql.Int, taskId)
            .query('UPDATE Tasks SET TaskStatus = \'started\' OUTPUT INSERTED.* WHERE TaskID = @taskId');

        if (task.AuthorID) {
            await db.request()
                .input('userId', sql.Int, task.AuthorID)
                .input('taskId', sql.Int, taskId)
                .input('message', sql.NVarChar, `Task "${task.Title}" has been started by the solver`)
                .query('INSERT INTO Notifications (UserID, TaskID, Message) VALUES (@userId, @taskId, @message)');
        }

        res.json(result.recordset[0]);

    } catch (error) {
        console.error('Start task error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/request/rely/complete', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'solver') {
            return res.status(403).json({ message: 'Only solvers can complete tasks' });
        }

        const { taskId } = req.body;

        if (!taskId) {
            return res.status(400).json({ message: 'Task ID required' });
        }

        if (!db) {
            return res.status(500).json({ message: 'Database not connected' });
        }

        const checkResult = await db.request()
            .input('taskId', sql.Int, taskId)
            .input('solverId', sql.Int, req.user.id)
            .query('SELECT * FROM Tasks WHERE TaskID = @taskId AND SolverID = @solverId');

        if (checkResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Task not found or not assigned to you' });
        }

        const task = checkResult.recordset[0];
        if (task.TaskStatus !== 'started') {
            return res.status(400).json({ message: `Task status must be 'started' to complete. Current status: ${task.TaskStatus}` });
        }

        const updateResult = await db.request()
            .input('taskId', sql.Int, taskId)
            .query('UPDATE Tasks SET TaskStatus = \'completed\' OUTPUT INSERTED.* WHERE TaskID = @taskId');

        if (task.AuthorID) {
            await db.request()
                .input('userId', sql.Int, task.AuthorID)
                .input('taskId', sql.Int, taskId)
                .input('message', sql.NVarChar, `Task "${task.Title}" has been completed by the solver`)
                .query('INSERT INTO Notifications (UserID, TaskID, Message) VALUES (@userId, @taskId, @message)');
        }

        res.json(updateResult.recordset[0]);

    } catch (error) {
        console.error('Complete task error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/request/rely/approved', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'author') {
            return res.status(403).json({ message: 'Only authors can approve tasks' });
        }

        const { taskId } = req.body;

        if (!taskId) {
            return res.status(400).json({ message: 'Task ID required' });
        }

        if (!db) {
            return res.status(500).json({ message: 'Database not connected' });
        }

        const checkResult = await db.request()
            .input('taskId', sql.Int, taskId)
            .input('authorId', sql.Int, req.user.id)
            .query('SELECT * FROM Tasks WHERE TaskID = @taskId AND AuthorID = @authorId');

        if (checkResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const task = checkResult.recordset[0];

        if (task.TaskStatus !== 'completed') {
            return res.status(400).json({ message: `Task status must be 'completed' to approve. Current status: ${task.TaskStatus}` });
        }

        const result = await db.request()
            .input('taskId', sql.Int, taskId)
            .query('UPDATE Tasks SET TaskStatus = \'approved\' OUTPUT INSERTED.* WHERE TaskID = @taskId');

        if (task.SolverID) {
            await db.request()
                .input('userId', sql.Int, task.SolverID)
                .input('taskId', sql.Int, taskId)
                .input('message', sql.NVarChar, 'Your task has been approved')
                .query('INSERT INTO Notifications (UserID, TaskID, Message) VALUES (@userId, @taskId, @message)');
        }

        res.json(result.recordset[0] || checkResult.recordset[0]);

    } catch (error) {
        console.error('Approve task error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/request/rely/rejected', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'author') {
            return res.status(403).json({ message: 'Only authors can reject tasks' });
        }

        const { taskId, reason } = req.body;

        if (!taskId) {
            return res.status(400).json({ message: 'Task ID required' });
        }

        if (!db) {
            return res.status(500).json({ message: 'Database not connected' });
        }

        const checkResult = await db.request()
            .input('taskId', sql.Int, taskId)
            .input('authorId', sql.Int, req.user.id)
            .query('SELECT * FROM Tasks WHERE TaskID = @taskId AND AuthorID = @authorId');

        if (checkResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const task = checkResult.recordset[0];

        if (task.TaskStatus !== 'completed') {
            return res.status(400).json({ message: `Task status must be 'completed' to reject. Current status: ${task.TaskStatus}` });
        }

        const request = db.request()
            .input('taskId', sql.Int, taskId);
        
        if (reason) {
            request.input('reason', sql.NVarChar, reason);
            await request.query('UPDATE Tasks SET TaskStatus = \'rejected\', RejectionReason = @reason OUTPUT INSERTED.* WHERE TaskID = @taskId');
        } else {
            await request.query('UPDATE Tasks SET TaskStatus = \'rejected\' OUTPUT INSERTED.* WHERE TaskID = @taskId');
        }

        const result = await db.request()
            .input('taskId', sql.Int, taskId)
            .query('SELECT * FROM Tasks WHERE TaskID = @taskId');

        if (task.SolverID) {
            const message = reason ? `Task rejected: ${reason}` : 'Your task has been rejected';
            await db.request()
                .input('userId', sql.Int, task.SolverID)
                .input('taskId', sql.Int, taskId)
                .input('message', sql.NVarChar, message)
                .query('INSERT INTO Notifications (UserID, TaskID, Message) VALUES (@userId, @taskId, @message)');
        }

        res.json(result.recordset[0]);

    } catch (error) {
        console.error('Reject task error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/notifications', authenticateToken, async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ message: 'Database not connected' });
        }

        const result = await db.request()
            .input('userId', sql.Int, req.user.id)
            .query('SELECT * FROM Notifications WHERE UserID = @userId ORDER BY CreatedAt DESC');

        res.json(result.recordset);

    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/notifications/:id/read', authenticateToken, async (req, res) => {
    try {
        const notifId = req.params.id;

        if (!db) {
            return res.status(500).json({ message: 'Database not connected' });
        }

        await db.request()
            .input('notifId', sql.Int, notifId)
            .query('UPDATE Notifications SET IsRead = 1 WHERE NotificationID = @notifId');

        res.json({ message: 'Notification marked as read' });

    } catch (error) {
        console.error('Mark notification read error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

connectDB().then((pool) => {
    db = pool;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error('Database connection failed:', err);
});

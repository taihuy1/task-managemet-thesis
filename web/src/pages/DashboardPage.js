import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import taskService from '../api/taskService';
import './Dashboard.css';

function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const userRole = localStorage.getItem('userRole');
  const username = localStorage.getItem('username') || 'User';
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/login');
      return;
    }
    loadTasks(true);
    loadNotifications();
  }, [navigate]);

  const loadTasks = async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      const response = await taskService.getAllTasks();
      setTasks(response.data);
      setError('');
    } catch (err) {
      console.log('Error loading tasks:', err);
      setError('Failed to load tasks');
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const loadNotifications = async () => {
    try {
      const response = await taskService.getNotifications();
      setNotifications(response.data);
    } catch (err) {
      console.log('Error loading notifications:', err);
    }
  };

  const handleRefresh = () => {
    loadTasks(false);
    loadNotifications();
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  if (loading) {
    return <div className="dashboard-container">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
        </div>
        <div className="header-right">
          <span>User: {username} | Role: {userRole}</span>
          <button onClick={handleRefresh}>Refresh</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <NotificationsPanel notifications={notifications} onUpdate={loadNotifications} onTaskUpdate={loadTasks} />

      {userRole === 'author' ? (
        <AuthorView tasks={tasks} onTaskUpdate={() => { loadTasks(); loadNotifications(); }} />
      ) : (
        <SolverView tasks={tasks} onTaskUpdate={() => { loadTasks(); loadNotifications(); }} />
      )}
    </div>
  );
}

function AuthorView({ tasks, onTaskUpdate }) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [solvers, setSolvers] = useState([]);
  const [loadingSolvers, setLoadingSolvers] = useState(true);
  const [solversError, setSolversError] = useState('');

  useEffect(() => {
    loadSolvers();
  }, []);

  const loadSolvers = async () => {
    try {
      setLoadingSolvers(true);
      setSolversError('');
      const response = await taskService.getSolvers();
      
      if (response && response.data && Array.isArray(response.data)) {
        setSolvers(response.data);
      } else {
        setSolversError('Failed to load solvers');
        setSolvers([]);
      }
    } catch (err) {
      console.log('Error loading solvers:', err);
      setSolversError('Failed to load solvers: ' + (err.response?.data?.message || err.message));
      setSolvers([]);
    } finally {
      setLoadingSolvers(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    if (!taskData.solvers || taskData.solvers.length === 0) {
      alert('Please select a solver for this task');
      return;
    }

    try {
      await taskService.createTask(taskData);
      setShowCreateForm(false);
      onTaskUpdate();
    } catch (err) {
      console.log('Error creating task:', err);
      alert('Failed to create task');
    }
  };

  const handleApprove = async (taskId) => {
    try {
      await taskService.approveTask(taskId);
      onTaskUpdate();
    } catch (err) {
      console.log('Error approving task:', err);
      alert('Failed to approve task');
    }
  };

  const handleReject = async (taskId) => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      try {
        await taskService.rejectTask(taskId, reason);
        onTaskUpdate();
      } catch (err) {
        console.log('Error rejecting task:', err);
        alert('Failed to reject task');
      }
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(taskId);
        onTaskUpdate();
      } catch (err) {
        console.log('Error deleting task:', err);
        alert('Failed to delete task: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <div>
      <div className="task-actions">
        <button onClick={() => setShowCreateForm(true)}>Create New Task</button>
      </div>

      {showCreateForm && (
        <CreateTaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setShowCreateForm(false)}
          solvers={solvers}
          isLoadingSolvers={loadingSolvers}
          solversError={solversError}
          onRetry={loadSolvers}
        />
      )}

      {solversError && !showCreateForm && (
        <div className="error-message">
          {solversError}
          <button onClick={loadSolvers}>Retry</button>
        </div>
      )}

      <div className="tasks-list">
        <h2>My Tasks</h2>
        {tasks.length === 0 ? (
          <p>No tasks yet. Create your first task!</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.TaskID}
              task={task}
              role="author"
              solvers={solvers}
              onApprove={() => handleApprove(task.TaskID)}
              onReject={() => handleReject(task.TaskID)}
              onDelete={() => handleDelete(task.TaskID)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function SolverView({ tasks, onTaskUpdate }) {
  const handleStartTask = async (taskId) => {
    try {
      await taskService.startTask(taskId);
      onTaskUpdate();
    } catch (err) {
      console.log('Error starting task:', err);
      alert('Failed to start task');
    }
  };

  const handleCompleteTask = async (taskId) => {
    const result = prompt('Enter completion result/notes:');
    if (result !== null) {
      try {
        await taskService.completeTask(taskId, result);
        onTaskUpdate();
      } catch (err) {
        console.log('Error completing task:', err);
        alert('Failed to complete task');
      }
    }
  };

  const assignedTasks = tasks.filter(t => t.SolverID);

  return (
    <div>
      <div className="tasks-list">
        <h2>Assigned Tasks</h2>
        {assignedTasks.length === 0 ? (
          <p>No tasks assigned to you yet.</p>
        ) : (
          assignedTasks.map((task) => (
            <TaskCard
              key={task.TaskID}
              task={task}
              role="solver"
              onStart={() => handleStartTask(task.TaskID)}
              onComplete={() => handleCompleteTask(task.TaskID)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function TaskCard({ task, role, solvers, onStart, onComplete, onApprove, onReject, onDelete }) {
  const getSolverName = (solverId) => {
    if (!solvers || solvers.length === 0 || !solverId) return 'Unassigned';
    const solver = solvers.find(s => parseInt(s.UserID) === parseInt(solverId));
    if (!solver) return 'Unknown Solver';
    return solver.FullName || solver.Username;
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <h3>{task.Title}</h3>
        <span>Status: {task.TaskStatus}</span>
      </div>
      <p className="task-description">{task.Description}</p>
      {role === 'author' && (
        <p className="task-solver">
          <strong>Assigned to:</strong> {getSolverName(task.SolverID)}
        </p>
      )}
      <div className="task-footer">
        <span>Created: {new Date(task.CreatedAt).toLocaleDateString()}</span>
        {role === 'author' && (
          <div className="task-actions">
            {task.TaskStatus === 'completed' && (
              <>
                <button onClick={onApprove}>Approve</button>
                <button onClick={onReject}>Reject</button>
              </>
            )}
            {onDelete && (
              <button onClick={onDelete}>Delete</button>
            )}
          </div>
        )}
        {role === 'solver' && (
          <div className="task-actions">
            {task.TaskStatus === 'waiting' && (
              <button onClick={onStart}>Start Task</button>
            )}
            {task.TaskStatus === 'started' && (
              <button onClick={onComplete}>Mark Complete</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CreateTaskForm({ onSubmit, onCancel, solvers, isLoadingSolvers, solversError, onRetry }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [selectedSolver, setSelectedSolver] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title || !desc) {
      alert('Please fill in title and description');
      return;
    }

    if (!selectedSolver) {
      alert('Please select a solver for this task');
      return;
    }

    const taskData = { 
      title, 
      desc,
      solvers: [parseInt(selectedSolver)]
    };
    
    onSubmit(taskData);
    setTitle('');
    setDesc('');
    setSelectedSolver('');
  };

  if (isLoadingSolvers) {
    return (
      <div className="create-task-form">
        <p>Loading solvers...</p>
      </div>
    );
  }

  if (solversError) {
    return (
      <div className="create-task-form">
        <div className="error-message">
          <p>{solversError}</p>
          <button onClick={onRetry}>Retry</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    );
  }

  if (solvers.length === 0) {
    return (
      <div className="create-task-form">
        <div className="error-message">
          <p>No solvers found in the system.</p>
          <button onClick={onRetry}>Refresh</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="create-task-form">
      <h3>Create New Task</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Assign to Solver *</label>
          <select 
            value={selectedSolver} 
            onChange={(e) => setSelectedSolver(e.target.value)}
            required
          >
            <option value="">-- Select a solver --</option>
            {solvers.map(solver => (
              <option key={solver.UserID} value={solver.UserID}>
                {solver.FullName || solver.Username}
              </option>
            ))}
          </select>
        </div>
        <div className="form-actions">
          <button type="submit">Create</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

function NotificationsPanel({ notifications, onUpdate, onTaskUpdate }) {
  const unreadCount = notifications.filter(n => !n.IsRead).length;

  const handleMarkRead = async (notifId) => {
    try {
      await taskService.markNotificationRead(notifId);
      onUpdate();
      onTaskUpdate();
    } catch (err) {
      console.log('Error marking notification read:', err);
    }
  };

  return (
    <div className="notifications-panel">
      <h3>
        Notifications 
        {unreadCount > 0 && <span>({unreadCount} unread)</span>}
      </h3>
      {notifications.length === 0 ? (
        <p>No notifications yet</p>
      ) : (
        <div className="notifications-list">
          {notifications.slice(0, 10).map((notif) => (
            <div 
              key={notif.NotificationID} 
              className="notification-item"
              onClick={() => !notif.IsRead && handleMarkRead(notif.NotificationID)}
              style={{cursor: notif.IsRead ? 'default' : 'pointer'}}
            >
              <p>{notif.Message}</p>
              <span className="notif-date">{new Date(notif.CreatedAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;

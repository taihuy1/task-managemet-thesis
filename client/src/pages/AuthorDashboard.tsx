import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useAuth } from '@/context/AuthContext';
import TaskList from '@/components/Author/TaskList';
import TaskCreationForm from '@/components/Author/TaskCreationForm';
import NotificationBell from '@/components/Notifications/NotificationBell';
import { TaskStatus } from '@/types/task.types';

export default function AuthorDashboard() {
    const { user, logout } = useAuth();
    const [filter, setFilter] = useState<TaskStatus | ''>('');
    const [showCreateForm, setShowCreateForm] = useState(false);

    const {
        tasks,
        loadTasks,
        createTask,
        deleteTask,
        approveTask,
        rejectTask,
        isLoading,
        error,
    } = useTasks({
        autoLoad: true,
        filters: filter ? { status: filter } : undefined,
    });

    const handleCreateTask = async (payload: Parameters<typeof createTask>[0]) => {
        try {
            await createTask(payload);
            setShowCreateForm(false);
        } catch (err) {
            console.error('Failed to create task:', err);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #ddd', paddingBottom: '16px' }}>
                <h1>Task Management</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <NotificationBell />
                    <span>Welcome, {user?.name}</span>
                    <button onClick={() => logout()}>Logout</button>
                </div>
            </header>

            {error && <div style={{ color: 'red', padding: '12px', backgroundColor: '#fee', borderRadius: '4px', marginBottom: '16px' }}>{error}</div>}

            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button onClick={() => setShowCreateForm(!showCreateForm)}>
                    {showCreateForm ? 'Cancel' : 'Create New Task'}
                </button>
                
                <label htmlFor="statusFilter">Filter:</label>
                <select
                    id="statusFilter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as TaskStatus)}
                    style={{ padding: '8px' }}
                >
                    <option value="">All Tasks</option>
                    <option value={TaskStatus.PENDING}>Pending</option>
                    <option value={TaskStatus.STARTED}>In Progress</option>
                    <option value={TaskStatus.COMPLETED}>Awaiting Approval</option>
                    <option value={TaskStatus.APPROVED}>Approved</option>
                </select>
                
                <button onClick={() => loadTasks()}>
                    Refresh
                </button>
            </div>

            {showCreateForm && (
                <TaskCreationForm
                    onSubmit={handleCreateTask}
                    onCancel={() => setShowCreateForm(false)}
                />
            )}

            {isLoading ? (
                <p>Loading tasks...</p>
            ) : (
                <TaskList
                    tasks={tasks}
                    onApprove={approveTask}
                    onReject={rejectTask}
                    onDelete={deleteTask}
                />
            )}
        </div>
    );
}

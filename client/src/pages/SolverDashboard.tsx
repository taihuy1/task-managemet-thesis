import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useAuth } from '@/context/AuthContext';
import AssignedTasksList from '@/components/Solver/AssignedTasksList';
import NotificationBell from '@/components/Notifications/NotificationBell';
import { TaskStatus } from '@/types/task.types';

export default function SolverDashboard() {
    const { user, logout } = useAuth();
    const [filter, setFilter] = useState<TaskStatus | ''>('');

    const {
        tasks,
        loadTasks,
        startTask,
        completeTask,
        isLoading,
        error,
    } = useTasks({
        autoLoad: true,
        filters: user ? { solverId: user.id, status: filter || undefined } : undefined,
    });

    const handleStartTask = async (id: string) => {
        try {
            await startTask(id);
        } catch (err) {
            console.error('Failed to start task:', err);
        }
    };

    const handleCompleteTask = async (id: string) => {
        try {
            await completeTask(id);
        } catch (err) {
            console.error('Failed to complete task:', err);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #ddd', paddingBottom: '16px' }}>
                <h1>My Tasks</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <NotificationBell />
                    <span>Welcome, {user?.name}</span>
                    <button onClick={() => logout()}>Logout</button>
                </div>
            </header>

            {error && <div style={{ color: 'red', padding: '12px', backgroundColor: '#fee', borderRadius: '4px', marginBottom: '16px' }}>{error}</div>}

            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <label htmlFor="statusFilter">Filter by Status:</label>
                <select
                    id="statusFilter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as TaskStatus)}
                    style={{ padding: '8px' }}
                >
                    <option value="">All Tasks</option>
                    <option value={TaskStatus.PENDING}>Pending</option>
                    <option value={TaskStatus.STARTED}>In Progress</option>
                    <option value={TaskStatus.COMPLETED}>Completed</option>
                    <option value={TaskStatus.APPROVED}>Approved</option>
                </select>
                <button onClick={() => loadTasks()}>
                    Refresh
                </button>
            </div>

            {isLoading ? (
                <p>Loading your tasks...</p>
            ) : (
                <AssignedTasksList
                    tasks={tasks}
                    onStart={handleStartTask}
                    onComplete={handleCompleteTask}
                />
            )}
        </div>
    );
}

import { Task, TaskStatus } from '@/types/task.types';

interface AssignedTasksListProps {
    tasks: Task[];
    onStart: (id: string) => Promise<unknown>;
    onComplete: (id: string) => Promise<unknown>;
}

function getStatusLabel(status: TaskStatus): string {
    const labels: Record<TaskStatus, string> = {
        [TaskStatus.PENDING]: 'Pending',
        [TaskStatus.STARTED]: 'In Progress',
        [TaskStatus.COMPLETED]: 'Completed',
        [TaskStatus.APPROVED]: 'Approved',
        [TaskStatus.REJECTED]: 'Rejected',
    };
    return labels[status] || status;
}

function getStatusColor(status: TaskStatus): string {
    const colors: Record<TaskStatus, string> = {
        [TaskStatus.PENDING]: '#6b7280',
        [TaskStatus.STARTED]: '#2563eb',
        [TaskStatus.COMPLETED]: '#059669',
        [TaskStatus.APPROVED]: '#10b981',
        [TaskStatus.REJECTED]: '#dc2626',
    };
    return colors[status] || '#6b7280';
}

export default function AssignedTasksList({ tasks, onStart, onComplete }: AssignedTasksListProps) {
    if (tasks.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                <p>No tasks assigned to you yet.</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'grid', gap: '16px' }}>
            {tasks.map((task) => (
                <div
                    key={task.id}
                    style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '20px',
                        backgroundColor: '#fff',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <h3 style={{ margin: 0, fontSize: '18px' }}>{task.title}</h3>
                        <span
                            style={{
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '500',
                                backgroundColor: getStatusColor(task.status) + '20',
                                color: getStatusColor(task.status),
                            }}
                        >
                            {getStatusLabel(task.status)}
                        </span>
                    </div>

                    <p style={{ color: '#4b5563', marginBottom: '12px', lineHeight: '1.5' }}>
                        {task.description}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', color: '#6b7280' }}>
                        <div>
                            <span>Priority: <strong>{task.priority}</strong></span>
                            <span style={{ marginLeft: '16px' }}>From: <strong>{task.author?.name}</strong></span>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            {task.status === TaskStatus.PENDING && (
                                <button
                                    onClick={() => onStart(task.id)}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#2563eb',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Start Working
                                </button>
                            )}
                            {task.status === TaskStatus.STARTED && (
                                <button
                                    onClick={() => onComplete(task.id)}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#059669',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Mark Complete
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

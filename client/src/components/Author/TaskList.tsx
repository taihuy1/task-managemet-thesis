import { Task, TaskStatus } from '@/types/task.types';

interface TaskListProps {
    tasks: Task[];
    onApprove: (id: string) => Promise<unknown>;
    onReject: (id: string) => Promise<unknown>;
    onDelete: (id: string) => Promise<unknown>;
}

function getStatusLabel(status: TaskStatus): string {
    const labels: Record<TaskStatus, string> = {
        [TaskStatus.PENDING]: 'Pending',
        [TaskStatus.STARTED]: 'In Progress',
        [TaskStatus.COMPLETED]: 'Awaiting Approval',
        [TaskStatus.APPROVED]: 'Approved',
        [TaskStatus.REJECTED]: 'Rejected',
    };
    return labels[status] || status;
}

function getStatusColor(status: TaskStatus): string {
    const colors: Record<TaskStatus, string> = {
        [TaskStatus.PENDING]: '#6b7280',
        [TaskStatus.STARTED]: '#2563eb',
        [TaskStatus.COMPLETED]: '#d97706',
        [TaskStatus.APPROVED]: '#10b981',
        [TaskStatus.REJECTED]: '#dc2626',
    };
    return colors[status] || '#6b7280';
}

export default function TaskList({ tasks, onApprove, onReject, onDelete }: TaskListProps) {
    if (tasks.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                <p>No tasks found. Create your first task to get started.</p>
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
                            {task.solver && (
                                <span style={{ marginLeft: '16px' }}>Assigned to: <strong>{task.solver.name}</strong></span>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            {task.status === TaskStatus.COMPLETED && (
                                <>
                                    <button
                                        onClick={() => onApprove(task.id)}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#10b981',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => onReject(task.id)}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#dc2626',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Reject
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => {
                                    if (confirm('Are you sure you want to delete this task?')) {
                                        onDelete(task.id);
                                    }
                                }}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: 'transparent',
                                    color: '#dc2626',
                                    border: '1px solid #dc2626',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

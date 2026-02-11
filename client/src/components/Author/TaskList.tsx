import { Task, TaskStatus } from '@/types/task.types';
import { getStatusLabel, getStatusColor } from '@/utils/taskHelpers';

interface Props {
    tasks: Task[];
    onApprove: (id: string) => Promise<unknown>;
    onReject: (id: string) => Promise<unknown>;
    onDelete: (id: string) => Promise<unknown>;
}

export default function TaskList({ tasks, onApprove, onReject, onDelete }: Props) {
    if (tasks.length === 0) {
        return <p style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>No tasks yet</p>;
    }

    return (
        <div style={{ display: 'grid', gap: '16px' }}>
            {tasks.map(task => (
                <div key={task.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px', backgroundColor: '#fff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <h3 style={{ margin: 0, fontSize: '18px' }}>{task.title}</h3>
                        <span style={{
                            padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 500,
                            backgroundColor: getStatusColor(task.status) + '20', color: getStatusColor(task.status),
                        }}>
                            {getStatusLabel(task.status)}
                        </span>
                    </div>

                    <p style={{ color: '#4b5563', marginBottom: '12px' }}>{task.description}</p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', color: '#6b7280' }}>
                        <div>
                            <span>Priority: <strong>{task.priority}</strong></span>
                            {task.solverId && <span style={{ marginLeft: '16px' }}>Solver assigned</span>}
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {task.status === TaskStatus.COMPLETED && (
                                <>
                                    <button onClick={() => onApprove(task.id)} style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '4px' }}>Approve</button>
                                    <button onClick={() => onReject(task.id)} style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px' }}>Reject</button>
                                </>
                            )}
                            <button
                                onClick={() => confirm('Delete this task?') && onDelete(task.id)}
                                style={{ backgroundColor: 'transparent', color: '#dc2626', border: '1px solid #dc2626', borderRadius: '4px' }}
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

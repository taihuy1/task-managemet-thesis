import { Task, TaskStatus } from '@/types/task.types';
import { getStatusLabel, getStatusColor } from '@/utils/taskHelpers';

interface Props {
    tasks: Task[];
    onStart: (id: string) => Promise<unknown>;
    onComplete: (id: string) => Promise<unknown>;
}

export default function AssignedTasksList({ tasks, onStart, onComplete }: Props) {
    if (tasks.length === 0) {
        return <p style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>No tasks assigned to you yet</p>;
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
                        <span>Priority: <strong>{task.priority}</strong></span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {task.status === TaskStatus.PENDING && (
                                <button onClick={() => onStart(task.id)} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px' }}>
                                    Start Working
                                </button>
                            )}
                            {task.status === TaskStatus.STARTED && (
                                <button onClick={() => onComplete(task.id)} style={{ backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '4px' }}>
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

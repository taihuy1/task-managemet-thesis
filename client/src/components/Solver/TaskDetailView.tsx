import { Task } from '@/types/task.types';
import { getStatusLabel } from '@/utils/taskHelpers';

interface Props {
    task: Task | null;
    onClose: () => void;
}

export default function TaskDetailView({ task, onClose }: Props) {
    if (!task) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
        }}>
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', maxWidth: '600px', width: '100%' }}>
                <h2>{task.title}</h2>
                <p>{task.description}</p>
                <p><strong>Status:</strong> {getStatusLabel(task.status)}</p>
                <p><strong>Priority:</strong> {task.priority}</p>
                <button onClick={onClose} style={{ marginTop: '16px' }}>Close</button>
            </div>
        </div>
    );
}

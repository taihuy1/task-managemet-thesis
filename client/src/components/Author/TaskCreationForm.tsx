import { useState, FormEvent } from 'react';
import { CreateTaskPayload, Priority } from '@/types/task.types';
import { useSolvers } from '@/hooks/useSolvers';

interface Props {
    onSubmit: (payload: CreateTaskPayload) => Promise<unknown>;
    onCancel?: () => void;
}

export default function TaskCreationForm({ onSubmit, onCancel }: Props) {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
    const [solverId, setSolverId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { solvers, error: solverError } = useSolvers();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!solverId) return;

        setIsSubmitting(true);
        try {
            await onSubmit({ title, desc, solvers: [solverId], priority });
            setTitle('');
            setDesc('');
            setPriority(Priority.MEDIUM);
            setSolverId('');
        } catch (err) {
            console.error('Failed to create task:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '24px', padding: '16px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h3>Create New Task</h3>
            {solverError && <p style={{ color: 'red' }}>{solverError}</p>}

            <div style={{ marginBottom: '12px' }}>
                <label htmlFor="title">Title</label>
                <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>

            <div style={{ marginBottom: '12px' }}>
                <label htmlFor="desc">Description</label>
                <textarea id="desc" value={desc} onChange={e => setDesc(e.target.value)} required rows={4} />
            </div>

            <div style={{ marginBottom: '12px' }}>
                <label htmlFor="solver">Assign to Solver</label>
                <select id="solver" value={solverId} onChange={e => setSolverId(e.target.value)} required>
                    <option value="">-- Select a Solver --</option>
                    {solvers.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                    ))}
                </select>
            </div>

            <div style={{ marginBottom: '12px' }}>
                <label htmlFor="priority">Priority</label>
                <select id="priority" value={priority} onChange={e => setPriority(e.target.value as Priority)} style={{ marginLeft: '8px' }}>
                    <option value={Priority.LOW}>Low</option>
                    <option value={Priority.MEDIUM}>Medium</option>
                    <option value={Priority.HIGH}>High</option>
                </select>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" disabled={isSubmitting || !solverId}>
                    {isSubmitting ? 'Creating...' : 'Create Task'}
                </button>
                {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
            </div>
        </form>
    );
}

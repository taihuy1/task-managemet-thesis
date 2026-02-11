import { useState, useEffect, FormEvent } from 'react';
import { CreateTaskPayload, Priority } from '@/types/task.types';
import { User } from '@/types/user.types';
import { getSolvers } from '@/services/api/userService';

interface TaskCreationFormProps {
    onSubmit: (payload: CreateTaskPayload) => Promise<unknown>;
    onCancel?: () => void;
}

export default function TaskCreationForm({ onSubmit, onCancel }: TaskCreationFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
    const [selectedSolver, setSelectedSolver] = useState('');
    const [solvers, setSolvers] = useState<User[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingError, setLoadingError] = useState<string | null>(null);

    useEffect(() => {
        const loadSolvers = async () => {
            try {
                const data = await getSolvers();
                setSolvers(data);
            } catch (err) {
                setLoadingError('Failed to load solvers');
            }
        };
        loadSolvers();
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!selectedSolver) {
            alert('Please select a solver to assign the task');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit({
                title,
                desc: description,
                solvers: [selectedSolver],
                priority,
            });
            setTitle('');
            setDescription('');
            setPriority(Priority.MEDIUM);
            setSelectedSolver('');
        } catch (error) {
            console.error('Failed to create task', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '24px', padding: '16px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h3>Create New Task</h3>
            
            {loadingError && <p style={{ color: 'red' }}>{loadingError}</p>}
            
            <div style={{ marginBottom: '12px' }}>
                <label htmlFor="title">Title:</label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                />
            </div>
            
            <div style={{ marginBottom: '12px' }}>
                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={4}
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                />
            </div>
            
            <div style={{ marginBottom: '12px' }}>
                <label htmlFor="solver">Assign to Solver:</label>
                <select
                    id="solver"
                    value={selectedSolver}
                    onChange={(e) => setSelectedSolver(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                >
                    <option value="">-- Select a Solver --</option>
                    {solvers.map((solver) => (
                        <option key={solver.id} value={solver.id}>
                            {solver.name} ({solver.email})
                        </option>
                    ))}
                </select>
            </div>
            
            <div style={{ marginBottom: '12px' }}>
                <label htmlFor="priority">Priority:</label>
                <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    style={{ padding: '8px', marginLeft: '8px' }}
                >
                    <option value={Priority.LOW}>Low</option>
                    <option value={Priority.MEDIUM}>Medium</option>
                    <option value={Priority.HIGH}>High</option>
                </select>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" disabled={isSubmitting || !selectedSolver}>
                    {isSubmitting ? 'Creating...' : 'Create Task'}
                </button>
                {onCancel && (
                    <button type="button" onClick={onCancel}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}

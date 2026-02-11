import { useState, useEffect, useCallback, useMemo } from 'react';
import { Task, CreateTaskPayload, UpdateTaskPayload, TaskStatus } from '@/types/task.types';
import * as taskService from '@/services/api/taskService';
import { normalizeError } from '@/utils/errorHandler';

interface UseTasksOptions {
    statusFilter?: TaskStatus;
    autoLoad?: boolean;
}

export function useTasks(options: UseTasksOptions = {}) {
    const { statusFilter, autoLoad = true } = options;
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadTasks = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await taskService.getTasks();
            setTasks(data);
        } catch (err) {
            const apiError = normalizeError(err);
            setError(apiError.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Client-side filtering (backend already filters by role via JWT)
    const filteredTasks = useMemo(() => {
        if (!statusFilter) return tasks;
        return tasks.filter(t => t.status === statusFilter);
    }, [tasks, statusFilter]);

    const createTask = async (payload: CreateTaskPayload) => {
        const task = await taskService.createTask(payload);
        setTasks(prev => [task, ...prev]);
        return task;
    };

    const updateTask = async (id: string, payload: UpdateTaskPayload) => {
        const updated = await taskService.updateTask(id, payload);
        setTasks(prev => prev.map(t => t.id === id ? updated : t));
        return updated;
    };

    const deleteTask = async (id: string) => {
        await taskService.deleteTask(id);
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    const approveTask = async (id: string) => {
        const updated = await taskService.approveTask(id);
        setTasks(prev => prev.map(t => t.id === id ? updated : t));
        return updated;
    };

    const rejectTask = async (id: string, reason?: string) => {
        const updated = await taskService.rejectTask(id, reason);
        setTasks(prev => prev.map(t => t.id === id ? updated : t));
        return updated;
    };

    const startTask = async (id: string) => {
        const updated = await taskService.startTask(id);
        setTasks(prev => prev.map(t => t.id === id ? updated : t));
        return updated;
    };

    const completeTask = async (id: string) => {
        const updated = await taskService.completeTask(id);
        setTasks(prev => prev.map(t => t.id === id ? updated : t));
        return updated;
    };

    useEffect(() => {
        if (autoLoad) loadTasks();
    }, [autoLoad, loadTasks]);

    return {
        tasks: filteredTasks,
        isLoading,
        error,
        loadTasks,
        createTask,
        updateTask,
        deleteTask,
        approveTask,
        rejectTask,
        startTask,
        completeTask,
    };
}

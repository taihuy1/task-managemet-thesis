import { useState, useEffect, useCallback } from 'react';
import { Task, CreateTaskPayload, UpdateTaskPayload, TaskStatus } from '@/types/task.types';
import * as taskService from '@/services/api/taskService';
import { normalizeError } from '@/utils/errorHandler';

interface UseTasksOptions {
    filters?: { status?: TaskStatus; authorId?: string; solverId?: string };
    autoLoad?: boolean;
}

/**
 * Custom hook for managing tasks
 * Provides CRUD operations and status change actions
 */
export function useTasks(options: UseTasksOptions = {}) {
    const { filters, autoLoad = true } = options;
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadTasks = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await taskService.getTasks(filters);
            setTasks(data);
        } catch (err) {
            const apiError = normalizeError(err);
            setError(apiError.message);
        } finally {
            setIsLoading(false);
        }
    }, [filters?.status, filters?.authorId, filters?.solverId]);

    const createTask = async (payload: CreateTaskPayload): Promise<Task> => {
        const task = await taskService.createTask(payload);
        setTasks((prev) => [task, ...prev]);
        return task;
    };

    const updateTask = async (id: string, payload: UpdateTaskPayload): Promise<Task> => {
        const updated = await taskService.updateTask(id, payload);
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
        return updated;
    };

    const deleteTask = async (id: string): Promise<void> => {
        await taskService.deleteTask(id);
        setTasks((prev) => prev.filter((t) => t.id !== id));
    };

    /**
     * Author approves a completed task
     */
    const approveTask = async (id: string): Promise<Task> => {
        const updated = await taskService.approveTask(id);
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
        return updated;
    };

    /**
     * Author rejects a completed task (resets to STARTED)
     */
    const rejectTask = async (id: string, reason?: string): Promise<Task> => {
        const updated = await taskService.rejectTask(id, reason);
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
        return updated;
    };

    /**
     * Solver starts working on a pending task
     */
    const startTask = async (id: string): Promise<Task> => {
        const updated = await taskService.startTask(id);
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
        return updated;
    };

    /**
     * Solver marks a task as complete
     */
    const completeTask = async (id: string): Promise<Task> => {
        const updated = await taskService.completeTask(id);
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
        return updated;
    };

    useEffect(() => {
        if (autoLoad) {
            loadTasks();
        }
    }, [autoLoad, loadTasks]);

    return {
        tasks,
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

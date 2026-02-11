import apiClient from './client';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import { Task, CreateTaskPayload, UpdateTaskPayload, TaskStatus } from '@/types/task.types';
import { ApiResponse } from '@/types/api.types';

/**
 * Fetch all tasks for the authenticated user
 * Authors see tasks they created, Solvers see assigned tasks
 */
export async function getTasks(filters?: { status?: TaskStatus; authorId?: string; solverId?: string }): Promise<Task[]> {
    const response = await apiClient.get<ApiResponse<Task[]>>(API_ENDPOINTS.TASKS.BASE, { params: filters });
    return response.data.data;
}

/**
 * Get a single task by ID
 */
export async function getTask(id: string): Promise<Task> {
    const response = await apiClient.get<ApiResponse<Task>>(API_ENDPOINTS.TASKS.BY_ID(id));
    return response.data.data;
}

/**
 * Create a new task (Author only)
 */
export async function createTask(payload: CreateTaskPayload): Promise<Task> {
    const response = await apiClient.post<ApiResponse<Task>>(API_ENDPOINTS.TASKS.BASE, payload);
    return response.data.data;
}

/**
 * Update task details
 */
export async function updateTask(id: string, payload: UpdateTaskPayload): Promise<Task> {
    const response = await apiClient.put<ApiResponse<Task>>(API_ENDPOINTS.TASKS.BY_ID(id), payload);
    return response.data.data;
}

/**
 * Delete a task (Author only)
 */
export async function deleteTask(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.TASKS.BY_ID(id));
}

/**
 * Approve a completed task (Author only)
 * Changes status: COMPLETED → APPROVED
 */
export async function approveTask(id: string): Promise<Task> {
    const response = await apiClient.patch<ApiResponse<Task>>(API_ENDPOINTS.TASKS.APPROVE(id));
    return response.data.data;
}

/**
 * Reject a completed task (Author only)
 * Changes status: COMPLETED → STARTED (solver must redo)
 */
export async function rejectTask(id: string, reason?: string): Promise<Task> {
    const response = await apiClient.patch<ApiResponse<Task>>(API_ENDPOINTS.TASKS.REJECT(id), { reason });
    return response.data.data;
}

/**
 * Start working on a task (Solver only)
 * Changes status: PENDING → STARTED
 */
export async function startTask(id: string): Promise<Task> {
    const response = await apiClient.patch<ApiResponse<Task>>(API_ENDPOINTS.TASKS.START(id));
    return response.data.data;
}

/**
 * Mark task as complete (Solver only)
 * Changes status: STARTED → COMPLETED
 */
export async function completeTask(id: string): Promise<Task> {
    const response = await apiClient.patch<ApiResponse<Task>>(API_ENDPOINTS.TASKS.COMPLETE(id));
    return response.data.data;
}

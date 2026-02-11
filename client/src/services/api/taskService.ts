import apiClient from './client';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import { Task, CreateTaskPayload, UpdateTaskPayload } from '@/types/task.types';
import { ApiResponse } from '@/types/api.types';

export async function getTasks(): Promise<Task[]> {
    const res = await apiClient.get<ApiResponse<Task[]>>(API_ENDPOINTS.TASKS.BASE);
    return res.data.data;
}

export async function getTask(id: string): Promise<Task> {
    const res = await apiClient.get<ApiResponse<Task>>(API_ENDPOINTS.TASKS.BY_ID(id));
    return res.data.data;
}

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
    const res = await apiClient.post<ApiResponse<Task>>(API_ENDPOINTS.TASKS.BASE, payload);
    return res.data.data;
}

export async function updateTask(id: string, payload: UpdateTaskPayload): Promise<Task> {
    const res = await apiClient.put<ApiResponse<Task>>(API_ENDPOINTS.TASKS.BY_ID(id), payload);
    return res.data.data;
}

export async function deleteTask(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.TASKS.BY_ID(id));
}

export async function approveTask(id: string): Promise<Task> {
    const res = await apiClient.patch<ApiResponse<Task>>(API_ENDPOINTS.TASKS.APPROVE(id));
    return res.data.data;
}

export async function rejectTask(id: string, reason?: string): Promise<Task> {
    const res = await apiClient.patch<ApiResponse<Task>>(API_ENDPOINTS.TASKS.REJECT(id), { reason });
    return res.data.data;
}

export async function startTask(id: string): Promise<Task> {
    const res = await apiClient.patch<ApiResponse<Task>>(API_ENDPOINTS.TASKS.START(id));
    return res.data.data;
}

export async function completeTask(id: string): Promise<Task> {
    const res = await apiClient.patch<ApiResponse<Task>>(API_ENDPOINTS.TASKS.COMPLETE(id));
    return res.data.data;
}

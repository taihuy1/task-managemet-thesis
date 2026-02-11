import apiClient from './client';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import { User } from '@/types/user.types';
import { ApiResponse } from '@/types/api.types';

/**
 * Fetch all available solvers for task assignment
 * Used by Authors when creating or editing tasks
 */
export async function getSolvers(): Promise<User[]> {
    const response = await apiClient.get<ApiResponse<User[]>>(API_ENDPOINTS.USERS.SOLVERS);
    return response.data.data;
}

/**
 * Get user details by ID
 */
export async function getUserById(id: string): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(API_ENDPOINTS.USERS.BY_ID(id));
    return response.data.data;
}

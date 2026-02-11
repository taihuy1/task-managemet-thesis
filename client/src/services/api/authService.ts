import apiClient from './client';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import {
    LoginCredentials,
    RegisterPayload,
    AuthResponse,
    User,
} from '@/types/user.types';
import { ApiResponse } from '@/types/api.types';

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Backend returns structure { success, message, data: { accessToken, user } }
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
    );
    return response.data.data;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
    // Backend returns structure { success, message, data: { accessToken, user } }
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.AUTH.REGISTER,
        payload
    );
    return response.data.data;
}

export async function logout(): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
}

export async function getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(API_ENDPOINTS.AUTH.ME);
    return response.data.data;
}

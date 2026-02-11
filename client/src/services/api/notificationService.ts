import apiClient from './client';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import { Notification } from '@/types/notification.types';
import { ApiResponse } from '@/types/api.types';

export async function getNotifications(): Promise<Notification[]> {
    const response = await apiClient.get<ApiResponse<Notification[]>>(API_ENDPOINTS.NOTIFICATIONS.BASE);
    return response.data.data;
}

export async function markAsRead(id: string): Promise<Notification> {
    const response = await apiClient.patch<ApiResponse<Notification>>(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
    return response.data.data;
}

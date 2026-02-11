import apiClient from './client';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import { Notification } from '@/types/notification.types';
import { ApiResponse } from '@/types/api.types';

export async function getNotifications(): Promise<Notification[]> {
    const res = await apiClient.get<ApiResponse<Notification[]>>(API_ENDPOINTS.NOTIFICATIONS.BASE);
    return res.data.data;
}

export async function markAsRead(id: string): Promise<void> {
    await apiClient.put(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
}

export async function markAllAsRead(): Promise<void> {
    await apiClient.put(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
}

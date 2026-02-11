import { useState, useEffect, useCallback } from 'react';
import { Notification } from '@/types/notification.types';
import * as notificationService from '@/services/api/notificationService';
import { normalizeError } from '@/utils/errorHandler';

export function useNotifications(autoLoad = true, pollInterval = 30000) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadNotifications = useCallback(async () => {
        try {
            // Don't set loading on poll to avoid UI flicker
            // setIsLoading(true); 
            const data = await notificationService.getNotifications();
            setNotifications(data);
        } catch (err) {
            console.error('Failed to load notifications', err);
            // Silent error for notifications usually
        }
    }, []);

    const markRead = async (id: string) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            );
        } catch (err) {
            console.error('Failed to mark notification as read', err);
        }
    };

    useEffect(() => {
        if (autoLoad) {
            loadNotifications();
            // Polling
            const intervalId = setInterval(loadNotifications, pollInterval);
            return () => clearInterval(intervalId);
        }
    }, [autoLoad, loadNotifications, pollInterval]);

    const unreadCount = notifications.filter((n) => !n.read).length;

    return {
        notifications,
        unreadCount,
        loadNotifications,
        markRead,
        isLoading,
        error,
    };
}

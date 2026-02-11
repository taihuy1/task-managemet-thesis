import { useState, useEffect, useCallback } from 'react';
import { Notification } from '@/types/notification.types';
import * as notificationService from '@/services/api/notificationService';

// Poll every 30s to keep notifications fresh
const DEFAULT_POLL_INTERVAL = 30000;

export function useNotifications(autoLoad = true, pollInterval = DEFAULT_POLL_INTERVAL) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadNotifications = useCallback(async () => {
        try {
            const data = await notificationService.getNotifications();
            setNotifications(data);
        } catch (err) {
            console.error('Failed to load notifications:', err);
        }
    }, []);

    const markRead = async (id: string) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, isRead: true } : n)
            );
        } catch (err) {
            console.error('Failed to mark as read:', err);
        }
    };

    const markAllRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        }
    };

    useEffect(() => {
        if (!autoLoad) return;
        loadNotifications();
        const id = setInterval(loadNotifications, pollInterval);
        return () => clearInterval(id);
    }, [autoLoad, loadNotifications, pollInterval]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return { notifications, unreadCount, loadNotifications, markRead, markAllRead, isLoading };
}

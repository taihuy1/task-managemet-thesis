export enum NotificationType {
    TASK_ASSIGNED = 'TASK_ASSIGNED',
    TASK_STATUS_CHANGED = 'TASK_STATUS_CHANGED',
    TASK_UPDATED = 'TASK_UPDATED',
}

export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    message: string;
    read: boolean;
    data?: any; // Related entity ID (e.g. taskId)
    createdAt: string;
}

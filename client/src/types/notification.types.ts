export enum NotificationType {
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  TASK_APPROVED = 'TASK_APPROVED',
  TASK_REJECTED = 'TASK_REJECTED',
  TASK_STARTED = 'TASK_STARTED',
  TASK_COMPLETED = 'TASK_COMPLETED',
}

export interface Notification {
  id: string;
  userId: string;
  taskId?: string;
  type?: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
}

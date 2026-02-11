import { TaskStatus, Priority } from '@/types/task.types';

const statusLabels: Record<TaskStatus, string> = {
  [TaskStatus.PENDING]: 'Pending',
  [TaskStatus.STARTED]: 'In Progress',
  [TaskStatus.COMPLETED]: 'Completed',
  [TaskStatus.APPROVED]: 'Approved',
  [TaskStatus.REJECTED]: 'Rejected',
};

const statusColors: Record<TaskStatus, string> = {
  [TaskStatus.PENDING]: '#6b7280',
  [TaskStatus.STARTED]: '#2563eb',
  [TaskStatus.COMPLETED]: '#d97706',
  [TaskStatus.APPROVED]: '#10b981',
  [TaskStatus.REJECTED]: '#dc2626',
};

const priorityLabels: Record<Priority, string> = {
  [Priority.LOW]: 'Low',
  [Priority.MEDIUM]: 'Medium',
  [Priority.HIGH]: 'High',
};

export function getStatusLabel(status: TaskStatus) {
  return statusLabels[status] || status;
}

export function getStatusColor(status: TaskStatus) {
  return statusColors[status] || '#6b7280';
}

export function getPriorityLabel(priority: Priority) {
  return priorityLabels[priority] || priority;
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}

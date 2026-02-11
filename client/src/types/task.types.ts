export enum TaskStatus {
    PENDING = 'PENDING',
    STARTED = 'STARTED',
    COMPLETED = 'COMPLETED',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

export enum Priority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
}

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: Priority;
    authorId: string;
    solverId?: string;
    startedAt?: string;
    completedAt?: string;
    approvedAt?: string;
    rejectedAt?: string;
    rejectionReason?: string;
    dueDate?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskPayload {
    title: string;
    desc: string;
    solvers: string[];
    priority?: Priority;
}

export interface UpdateTaskPayload {
    title?: string;
    desc?: string;
    priority?: Priority;
    solverId?: string;
    status?: TaskStatus;
}

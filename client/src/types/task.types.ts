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
    author: {
        id: string;
        name: string;
        email: string;
    };
    solver?: {
        id: string;
        name: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
    completedAt?: string;
    approvedAt?: string;
}

/**
 * Payload for creating a new task
 * Backend expects: { title, desc, solvers: [solverId] }
 */
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

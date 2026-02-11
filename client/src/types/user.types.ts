export enum Role {
    AUTHOR = 'AUTHOR',
    SOLVER = 'SOLVER',
    ADMIN = 'ADMIN',
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: Role;
    createdAt: string;
    updatedAt: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterPayload {
    email: string;
    password: string;
    name: string;
    role: Role;
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    success?: boolean;
    timestamp?: string;
}

export interface ApiError {
    message: string;
    status: number;
    code?: string;
    errors?: any;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
}

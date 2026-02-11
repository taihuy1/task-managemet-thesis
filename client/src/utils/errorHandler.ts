import { ApiError } from '@/types/api.types';
import axios, { AxiosError } from 'axios';

export function normalizeError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<any>;
        return {
            message: axiosError.response?.data?.message || axiosError.message,
            status: axiosError.response?.status || 500,
            code: axiosError.code,
            errors: axiosError.response?.data?.errors,
        };
    }

    if (error instanceof Error) {
        return {
            message: error.message,
            status: 500,
        };
    }

    return {
        message: 'An unknown error occurred',
        status: 500,
    };
}

export function isAuthError(error: ApiError): boolean {
    return error.status === 401 || error.status === 403;
}

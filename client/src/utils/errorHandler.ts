import { ApiError } from '@/types/api.types';
import axios, { AxiosError } from 'axios';

export function normalizeError(err: unknown): ApiError {
    if (axios.isAxiosError(err)) {
        const axErr = err as AxiosError<any>;
        return {
            message: axErr.response?.data?.message || axErr.message,
            status: axErr.response?.status || 500,
            code: axErr.code,
        };
    }

    if (err instanceof Error) {
        return { message: err.message, status: 500 };
    }

    return { message: 'Something went wrong', status: 500 };
}

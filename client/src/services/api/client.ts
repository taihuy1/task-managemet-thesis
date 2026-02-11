import axios, { InternalAxiosRequestConfig } from 'axios';
import { config } from '@/constants/config';
import { getToken, clearAuth } from '@/services/storage/authStorage';

const apiClient = axios.create({
    baseURL: config.apiBaseUrl,
    timeout: config.apiTimeout,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor: attach token
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: handle 401
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            clearAuth();
            // Only redirect if not already on login page to avoid loops
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;

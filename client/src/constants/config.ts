export const config = {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
    apiTimeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
} as const;

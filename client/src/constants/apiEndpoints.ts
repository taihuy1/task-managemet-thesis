export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        ME: '/auth/me',
    },
    TASKS: {
        BASE: '/task',
        BY_ID: (id: string) => `/task/${id}`,
        START: (id: string) => `/task/${id}/start`,
        COMPLETE: (id: string) => `/task/${id}/complete`,
        APPROVE: (id: string) => `/task/${id}/approve`,
        REJECT: (id: string) => `/task/${id}/reject`,
    },
    NOTIFICATIONS: {
        BASE: '/notifications',
        BY_ID: (id: string) => `/notifications/${id}`,
        MARK_READ: (id: string) => `/notifications/${id}/read`,
    },
    USERS: {
        BASE: '/users',
        BY_ID: (id: string) => `/users/${id}`,
        SOLVERS: '/users',
    },
} as const;

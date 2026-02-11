import axios from 'axios';

// Axios instance configured with base URL and default headers
// baseURL uses environment variable for deployment flexibility
const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000 // 10 second timeout prevents hanging requests
});

// Request interceptor: Automatically adds JWT token to all requests
// Centralizes authentication logic - no need to add token in each API call
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor: Handles common error scenarios
// Redirects to login on 401 (unauthorized), provides user-friendly error messages
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - clear storage and redirect
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userId');
            // Note: Navigation handled by ProtectedRoute component
        }
        return Promise.reject(error);
    }
);

export default axiosClient;

import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants/routes';
import { Role } from '@/types/user.types';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await login({ email, password });
            // Navigation logic based on role will be handled here or in the component after login
            // For now, we need to access user from context again or waiting for state update
            // But typically we can just redirect.
            // Since setUser is async in React state, accessing user immediately might be stale.
            // A better way is to let the user object be returned from login or check in useEffect.
            // For this migration, we'll try to get user from local storage or wait.
            // Actually, let's redirect to HOME and let the ProtectedRoute handle redirection based on role.
            // But we don't have ProtectedRoute yet.
            // Let's implement simple redirection for now.

            const storedUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
            if (storedUser?.role === Role.AUTHOR) {
                navigate(ROUTES.AUTHOR_DASHBOARD);
            } else {
                navigate(ROUTES.SOLVER_DASHBOARD);
            }
        } catch (err) {
            // Error handled by AuthContext
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px' }}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '16px' }}>
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '16px' }}>
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}

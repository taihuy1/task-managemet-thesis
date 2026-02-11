import {
    createContext,
    useContext,
    useState,
    ReactNode,
} from 'react';
import { User, LoginCredentials } from '@/types/user.types';
import * as authService from '@/services/api/authService';
import { saveToken, saveUser, getUser, clearAuth } from '@/services/storage/authStorage';
import { normalizeError } from '@/utils/errorHandler';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<User>;
    logout: () => Promise<void>;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(getUser<User>());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isAuthenticated = !!user;

    const login = async (credentials: LoginCredentials): Promise<User> => {
        try {
            setIsLoading(true);
            setError(null);
            const { accessToken, user: loggedInUser } = await authService.login(credentials);
            saveToken(accessToken);
            saveUser(loggedInUser);
            setUser(loggedInUser);
            return loggedInUser;
        } catch (err) {
            const apiError = normalizeError(err);
            setError(apiError.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            clearAuth();
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, isAuthenticated, isLoading, login, logout, error }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

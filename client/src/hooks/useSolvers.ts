import { useState, useEffect } from 'react';
import { User } from '@/types/user.types';
import * as userService from '@/services/api/userService';

export function useSolvers() {
    const [solvers, setSolvers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                setIsLoading(true);
                const data = await userService.getSolvers();
                setSolvers(data);
            } catch (err) {
                setError('Failed to load solvers');
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    return { solvers, isLoading, error };
}

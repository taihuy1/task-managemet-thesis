import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/types/user.types';
import { ROUTES } from '@/constants/routes';

interface RequireAuthProps {
    allowedRoles?: Role[];
}

export default function RequireAuth({ allowedRoles }: RequireAuthProps) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div>Loading authentication...</div>;
    }

    if (!isAuthenticated || !user) {
        return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard if role doesn't match
        const redirectPath = user.role === Role.AUTHOR ? ROUTES.AUTHOR_DASHBOARD : ROUTES.SOLVER_DASHBOARD;
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
}

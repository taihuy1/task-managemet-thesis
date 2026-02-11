import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ROUTES } from '@/constants/routes';
import { Role } from '@/types/user.types';
import LoginPage from '@/pages/LoginPage';
import AuthorDashboard from '@/pages/AuthorDashboard';
import SolverDashboard from '@/pages/SolverDashboard';
import RequireAuth from '@/components/Layout/RequireAuth';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path={ROUTES.LOGIN} element={<LoginPage />} />

                    {/* Protected Routes */}
                    <Route element={<RequireAuth allowedRoles={[Role.AUTHOR]} />}>
                        <Route path={ROUTES.AUTHOR_DASHBOARD} element={<AuthorDashboard />} />
                    </Route>

                    <Route element={<RequireAuth allowedRoles={[Role.SOLVER]} />}>
                        <Route path={ROUTES.SOLVER_DASHBOARD} element={<SolverDashboard />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;

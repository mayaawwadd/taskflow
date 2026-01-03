import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return null;

    // Already logged in → redirect
    if (isAuthenticated) {
        return <Navigate to="/workspaces" replace />;
    }

    return <Outlet />;
};

export default PublicRoute;

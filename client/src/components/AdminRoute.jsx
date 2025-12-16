import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user && user.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default AdminRoute;

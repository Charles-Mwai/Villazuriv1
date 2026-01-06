import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('admin_authenticated') === 'true';

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

export default ProtectedRoute;

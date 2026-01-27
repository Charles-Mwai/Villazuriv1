import { Navigate } from 'react-router-dom';
import React from 'react';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
    const token = localStorage.getItem('admin_token');
    const loginTime = parseInt(localStorage.getItem('admin_login_time') || '0');
    const now = new Date().getTime();

    // Check if authenticated AND has a token AND token is less than 2 hours old (7200000 ms)
    const isTokenValid = isAuthenticated && token && (now - loginTime < 7200000);

    if (!isTokenValid) {
        // Clear stale auth data
        localStorage.removeItem('admin_authenticated');
        localStorage.removeItem('admin_token');
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

export default ProtectedRoute;

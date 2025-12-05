import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const checkAuth = () => {
        const sessionStr = localStorage.getItem('adminSession');
        if (!sessionStr) return false;

        try {
            const session = JSON.parse(sessionStr);
            if (!session.isAuthenticated) return false;

            return true;
        } catch (e) {
            return false;
        }
    };

    if (!checkAuth()) {
        return <Navigate to="/admin" replace />;
    }

    return children;
};

export default ProtectedRoute;

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext'; // Import our new hook

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // While checking for a user, show a loading screen
  if (loading) {
    return <div>Loading...</div>;
  }

  // If there is a user, show the requested page
  if (user) {
    return <>{children}</>;
  }

  // If no user and not loading, redirect to login
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
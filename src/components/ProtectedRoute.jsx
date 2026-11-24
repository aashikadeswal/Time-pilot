/**
 * ProtectedRoute component
 * Wraps routes that require authentication. Redirects to /signin if not logged in.
 * Shows a loading spinner while session validation is in progress.
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="bg-background font-display min-h-screen flex items-center justify-center transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-on-surface-variant text-body-md font-medium">Loading your session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the attempted URL so we can redirect back after login
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
}

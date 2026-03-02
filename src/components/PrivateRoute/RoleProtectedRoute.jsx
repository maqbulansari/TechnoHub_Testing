import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../contexts/authContext';
import { Forbidden } from '../Forbidden/Forbidden';

/**
 * Role-based Protected Route Component
 * @param {Array<string>} allowedRoles - Array of roles allowed to access this route
 * @param {React.ReactNode} children - Child elements to render if access is granted
 */
export const RoleProtectedRoute = ({ allowedRoles = [], children = null }) => {
  const accessToken = localStorage.getItem('accessToken') || '';
  const { hasRole } = useContext(AuthContext);

  // If no token, redirect to login
  if (!accessToken) {
    return <Navigate to="/" replace />;
  }

  // If allowedRoles is defined and not empty, check if user has any required role
  if (allowedRoles.length > 0) {
    const allowed = allowedRoles.some((r) => hasRole(r));
    if (!allowed) return <Forbidden />;
  }

  return children ? children : <Outlet />;
};

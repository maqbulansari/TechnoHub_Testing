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
  const userRole = localStorage.getItem('role') || '';

  // If no token, redirect to login
  if (!accessToken) {
    return <Navigate to="/" replace />;
  }

  // If allowedRoles is defined and not empty, check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Forbidden />;
  }

  return children ? children : <Outlet />;
};

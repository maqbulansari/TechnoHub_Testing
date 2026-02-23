import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../contexts/authContext';

export const ProtectedRoute = ({ children = null, allowedRoles = [], allowedSubroles = [] }) => {

  const accessToken = localStorage.getItem('accessToken') || '';
  const { hasRole, hasSubrole } = useContext(AuthContext);

  // No access token - redirect to login
  if (!accessToken) {
    return <Navigate to="/" replace />;
  }

  // If specific roles are required, check them
  if (allowedRoles.length > 0) {
    const hasAllowedRole = allowedRoles.some(role => hasRole(role));
    if (!hasAllowedRole) {
      return <Navigate to="/" replace />;
    }
  }

  // If specific subroles are required, check them
  if (allowedSubroles.length > 0) {
    const hasAllowedSubrole = allowedSubroles.some(subrole => hasSubrole(subrole));
    if (!hasAllowedSubrole) {
      return <Navigate to="/" replace />;
    }
  }

  // All checks passed - grant access
  return children ? children : <Outlet />;
};
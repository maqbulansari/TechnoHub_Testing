import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../contexts/authContext';

export const ProtectedRoute = ({ children = null }) => {

  const accessToken = localStorage.getItem('accessToken') || '';
  const userRole = localStorage.getItem('role') || '';



  if (userRole === "ADMIN") {
    return children ? children : <Outlet />;
  }

  if (!accessToken) {
    return <Navigate to="/login-3" replace />;
  }

  return children ? children : <Outlet />;
};
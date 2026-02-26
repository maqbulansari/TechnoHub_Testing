import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../contexts/authContext';

export const ProtectedRoute = ({ children = null, allowedRoles = [], allowedSubroles = [] }) => {

  const accessToken = localStorage.getItem('accessToken') || '';
  const { hasRole, hasSubrole, roles, responseSubrole } = useContext(AuthContext);

  // Not authenticated -> send to landing/login
  if (!accessToken) {
    return <Navigate to="/" replace />;
  }

  // If specific roles are required, check them -> forbidden if not allowed
  // Role/Subrole authorization: allow if user has any of the allowed roles OR any of the allowed subroles.
  if (allowedRoles.length > 0 || allowedSubroles.length > 0) {
    // Check via context helpers first
    let hasAllowedRole = allowedRoles.length > 0 ? allowedRoles.some(role => hasRole(role)) : false;
    let hasAllowedSubrole = allowedSubroles.length > 0 ? allowedSubroles.some(subrole => hasSubrole(subrole)) : false;

    // Fallback: if AuthContext hasn't populated roles/subroles yet, check localStorage directly
    if (!hasAllowedRole) {
      const storageRolesRaw = localStorage.getItem("roles") || localStorage.getItem("role");
      if (storageRolesRaw) {
        try {
          const parsed = JSON.parse(storageRolesRaw);
          const arr = Array.isArray(parsed) ? parsed : String(parsed).split(",").map(s => s.trim()).filter(Boolean);
          hasAllowedRole = arr.map(r => String(r).toUpperCase()).some(r => allowedRoles.map(ar => String(ar).toUpperCase()).includes(r));
        } catch (e) {
          const arr = String(storageRolesRaw).split(",").map(s => s.trim()).filter(Boolean);
          hasAllowedRole = arr.map(r => String(r).toUpperCase()).some(r => allowedRoles.map(ar => String(ar).toUpperCase()).includes(r));
        }
      }
    }

    if (!hasAllowedSubrole) {
      const storageSubRaw = localStorage.getItem("subroles") || localStorage.getItem("subrole");
      if (storageSubRaw) {
        try {
          const parsed = JSON.parse(storageSubRaw);
          const arr = Array.isArray(parsed) ? parsed : String(parsed).split(",").map(s => s.trim()).filter(Boolean);
          hasAllowedSubrole = arr.map(s => String(s).toUpperCase().replace(/\s+/g, "_")).some(s => allowedSubroles.map(as => String(as).toUpperCase().replace(/\s+/g, "_")).includes(s));
        } catch (e) {
          const arr = String(storageSubRaw).split(",").map(s => s.trim()).filter(Boolean);
          hasAllowedSubrole = arr.map(s => String(s).toUpperCase().replace(/\s+/g, "_")).some(s => allowedSubroles.map(as => String(as).toUpperCase().replace(/\s+/g, "_")).includes(s));
        }
      }
    }

    if (!hasAllowedRole && !hasAllowedSubrole) {
      // Diagnostic logging to help debug why a user was denied access
      try {
        console.warn("ProtectedRoute deny:", {
          allowedRoles,
          allowedSubroles,
          hasAllowedRole,
          hasAllowedSubrole,
          contextRoles: roles,
          contextSubroles: responseSubrole,
          storageRoles: localStorage.getItem("roles") || localStorage.getItem("role"),
          storageSubroles: localStorage.getItem("subroles") || localStorage.getItem("subrole"),
        });
      } catch (e) {
        // ignore logging errors
      }
      return <Navigate to="/forbidden" replace />;
    }
  }

  // All checks passed - grant access
  return children ? children : <Outlet />;
};
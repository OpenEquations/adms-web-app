import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

/**
 * Gates a route behind login, and optionally behind a permission or
 * superadmin role. This is on top of (not instead of) hiding the nav link -
 * without it, a user who knows/guesses the URL could reach a page the
 * sidebar hides from them.
 */
function ProtectedRoute({ children, permission, superAdminOnly = false }) {
  const { isAuthenticated, isSuperAdmin, hasPermission } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  const lacksAccess =
    (superAdminOnly && !isSuperAdmin) ||
    (permission && !hasPermission(permission));

  if (lacksAccess) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;

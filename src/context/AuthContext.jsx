import { createContext, useContext, useState } from "react";

import { authApi } from "../lib/api/auth";
import { AUTH_TOKEN_STORAGE_KEY } from "../lib/apiClient";

const AuthContext = createContext(null);

const USER_STORAGE_KEY = "adms.currentUser";

function readStoredUser() {
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function writeStoredUser(user) {
  try {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  } catch {
    // Ignore storage failures (private browsing, quota, etc.)
  }
}

function writeStoredToken(token) {
  try {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    }
  } catch {
    // Ignore storage failures (private browsing, quota, etc.)
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  const login = async (email, password) => {
    const { token, user: loggedInUser } = await authApi.login(email, password);
    setUser(loggedInUser);
    writeStoredUser(loggedInUser);
    writeStoredToken(token);
    return loggedInUser;
  };

  const updateUser = (changes) => {
    setUser((current) => {
      if (!current) {
        return current;
      }
      const updated = { ...current, ...changes };
      writeStoredUser(updated);
      return updated;
    });
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Best-effort: clear the local session regardless of server reachability.
    }
    setUser(null);
    writeStoredUser(null);
    writeStoredToken(null);
  };

  const isSuperAdmin = user?.role === "SUPERADMIN";

  const hasPermission = (permission) =>
    isSuperAdmin || Boolean(user?.permissions?.includes(permission));

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isSuperAdmin,
    hasPermission,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

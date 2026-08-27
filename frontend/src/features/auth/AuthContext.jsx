import { createContext, useCallback, useEffect, useState } from "react";
import { TOKEN_KEYS } from "../../lib/apiClient";
import {
  fetchCurrentUser,
  loginRequest,
  logoutRequest,
  registerRequest,
} from "./api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const loadCurrentUser = useCallback(async () => {
    const hasToken = localStorage.getItem(TOKEN_KEYS.access);
    if (!hasToken) {
      setInitializing(false);
      return;
    }
    try {
      const me = await fetchCurrentUser();
      setUser(me);
    } catch {
      // token invalid/expired and refresh already failed in the interceptor
      localStorage.removeItem(TOKEN_KEYS.access);
      localStorage.removeItem(TOKEN_KEYS.refresh);
      setUser(null);
    } finally {
      setInitializing(false);
    }
  }, []);

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  const login = useCallback(async (credentials) => {
    const { access_token, refresh_token } = await loginRequest(credentials);
    localStorage.setItem(TOKEN_KEYS.access, access_token);
    localStorage.setItem(TOKEN_KEYS.refresh, refresh_token);
    const me = await fetchCurrentUser();
    setUser(me);
    return me;
  }, []);

  const register = useCallback(async (payload) => {
    await registerRequest(payload);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch {
      // ignore network/server errors on logout, clear the session locally regardless
    }
    localStorage.removeItem(TOKEN_KEYS.access);
    localStorage.removeItem(TOKEN_KEYS.refresh);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const me = await fetchCurrentUser();
    setUser(me);
    return me;
  }, []);

  const value = {
    user,
    isAuthenticated: Boolean(user),
    initializing,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

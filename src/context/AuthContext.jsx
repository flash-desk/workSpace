import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { setAccessToken } from "../api/client";
import * as authApi from "../api/auth";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Try to restore the session from the refresh cookie on first load.
  useEffect(() => {
    (async () => {
      try {
        const { accessToken } = await authApi.refreshSession();
        setAccessToken(accessToken);
        const me = await authApi.getMe();
        setUser(me.data.user);
      } catch {
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authApi.loginUser({ email, password });
    setAccessToken(res.accessToken);
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const logout = useCallback(async () => {
    try { await authApi.logoutUser(); } catch { /* ignore */ }
    setAccessToken(null);
    setUser(null);
  }, []);

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

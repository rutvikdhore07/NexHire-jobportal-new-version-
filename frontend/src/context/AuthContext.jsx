import { createContext, useState, useEffect, useContext, useMemo, useCallback } from "react";
import API from "../api/axios";

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const token  = localStorage.getItem("accessToken");
    if (stored && token) {
      try { setUser(JSON.parse(stored)); } catch { localStorage.clear(); }
    }
    setLoading(false);
  }, []);

  const _saveAuth = (accessToken, refreshToken, userData) => {
    localStorage.setItem("accessToken",  accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user",         JSON.stringify(userData));
    setUser(userData);
  };

  const login = useCallback(async (credentials) => {
    const res = await API.post("/auth/login", credentials);
    const { accessToken, refreshToken, user: userData } = res.data.data;
    _saveAuth(accessToken, refreshToken, userData);
    return userData;
  }, []);

  const register = useCallback(async (data) => {
    const res = await API.post("/auth/register", data);
    const { accessToken, refreshToken, user: userData } = res.data.data;
    _saveAuth(accessToken, refreshToken, userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.clear();
    setUser(null);
  }, []);

  const updateUser = useCallback((updated) => {
    const merged = { ...user, ...updated };
    localStorage.setItem("user", JSON.stringify(merged));
    setUser(merged);
  }, [user]);

  const value = useMemo(() => ({
    user, loading, login, register, logout, updateUser,
    isAuthenticated: !!user,
    isRecruiter:     user?.role === "RECRUITER",
    isAdmin:         user?.role === "ADMIN",
  }), [user, loading, login, register, logout, updateUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

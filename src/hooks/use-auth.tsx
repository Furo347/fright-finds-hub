import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type AuthContextValue = {
  token: string | null;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  authHeaders: () => HeadersInit;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Persist the token in localStorage to keep admin session across refreshes
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("auth_token"));

  useEffect(() => {
    if (token) {
      localStorage.setItem("auth_token", token);
    } else {
      localStorage.removeItem("auth_token");
    }
  }, [token]);

  // Perform login against the backend, store JWT if successful
  const login = useCallback(async (username: string, password: string) => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { token?: string };
    if (data.token) {
      setToken(data.token);
      return true;
    }
    return false;
  }, []);

  // Clear local session
  const logout = useCallback(() => {
    setToken(null);
  }, []);

  const isAdmin = useMemo(() => Boolean(token), [token]);

  const authHeaders = useCallback((): HeadersInit => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  const value = useMemo<AuthContextValue>(() => ({ token, isAdmin, login, logout, authHeaders }), [token, isAdmin, login, logout, authHeaders]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}



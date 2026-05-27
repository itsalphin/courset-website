'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // Access token lives in memory only. Storing it in localStorage exposes it
  // to any XSS that lands on the page. The httpOnly refresh-token cookie is
  // what survives reloads — we exchange it for a fresh access token on mount.
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Try to restore a session by exchanging the httpOnly refresh cookie for a
  // new access token. No secrets touch localStorage.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' });
        if (!cancelled && res.ok) {
          const data = await res.json();
          if (data.accessToken) setAccessToken(data.accessToken);
          if (data.user) setUser(data.user);
        }
      } catch {
        // No refresh cookie or refresh failed — user stays signed out.
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error };

      setUser(data.user);
      setAccessToken(data.accessToken);
      return { success: true };
    } catch {
      return { success: false, error: 'An error occurred.' };
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error };

      setUser(data.user);
      setAccessToken(data.accessToken);
      return { success: true };
    } catch {
      return { success: false, error: 'An error occurred.' };
    }
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

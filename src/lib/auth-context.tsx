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
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Try to restore session on mount
  useEffect(() => {
    const stored = localStorage.getItem('courset-user');
    const token = localStorage.getItem('courset-token');
    if (stored && token) {
      try {
        setUser(JSON.parse(stored));
        setAccessToken(token);
      } catch {}
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error };

      setUser(data.user);
      setAccessToken(data.accessToken);
      localStorage.setItem('courset-user', JSON.stringify(data.user));
      localStorage.setItem('courset-token', data.accessToken);
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
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error };

      setUser(data.user);
      setAccessToken(data.accessToken);
      localStorage.setItem('courset-user', JSON.stringify(data.user));
      localStorage.setItem('courset-token', data.accessToken);
      return { success: true };
    } catch {
      return { success: false, error: 'An error occurred.' };
    }
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('courset-user');
    localStorage.removeItem('courset-token');
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

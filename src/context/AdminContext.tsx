import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

interface AdminContextValue {
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

const STORAGE_KEY = 'gatectr_admin_token';

function loadStoredToken(): string | null {
  try {
    const t = localStorage.getItem(STORAGE_KEY);
    if (!t) return null;
    const payload = JSON.parse(atob(t.split('.')[1])) as { exp?: number };
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return t;
  } catch {
    return null;
  }
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(loadStoredToken);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const text = await res.text();
    let json: Record<string, unknown> = {};
    try { json = JSON.parse(text); } catch { /* empty body or non-JSON */ }
    if (!res.ok) {
      throw new Error((json.error as string | undefined) ?? 'Identifiants invalides.');
    }
    const t = (json as { token: string }).token;
    localStorage.setItem(STORAGE_KEY, t);
    setToken(t);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
  }, []);

  return (
    <AdminContext.Provider value={{ token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used inside AdminProvider');
  return ctx;
}

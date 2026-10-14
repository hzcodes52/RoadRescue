import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from './types';
import { api } from './api';

export interface RegisterData {
  name: string; email: string; password: string; contactNumber: string;
  accountType?: 'customer' | 'mechanic' | undefined; serviceArea?: string | undefined; serviceCategories?: string[] | undefined;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: RegisterData) => Promise<{ needsConfirmation: boolean }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  isAdmin: boolean;
  isMechanic: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function save(token: string, user: User) {
  localStorage.setItem('rr_token', token);
  localStorage.setItem('rr_user', JSON.stringify(user));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Session token only; the profile is re-validated with the Java backend.
    if (localStorage.getItem('rr_token')) {
      api.me().then(setUser).catch(() => { localStorage.removeItem('rr_token'); localStorage.removeItem('rr_user'); })
        .finally(() => setLoading(false));
    } else setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login({ email, password });
    save(res.token, res.user); setUser(res.user);
    return res.user;
  };

  const register = async (d: RegisterData) => {
    const base = { name: d.name, email: d.email, password: d.password, contactNumber: d.contactNumber };
    const res = d.accountType === 'mechanic'
      ? await api.registerMechanic({ ...base, serviceArea: d.serviceArea, serviceCategories: d.serviceCategories })
      : await api.register(base);
    save(res.token, res.user); setUser(res.user);
    return { needsConfirmation: false };
  };

  const logout = async () => {
    localStorage.removeItem('rr_token'); localStorage.removeItem('rr_user'); setUser(null);
  };

  const refresh = async () => { setUser(await api.me()); };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh, isAdmin: user?.role === 'ADMIN', isMechanic: user?.role === 'MECHANIC' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

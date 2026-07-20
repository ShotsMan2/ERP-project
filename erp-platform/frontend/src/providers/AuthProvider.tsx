import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/services/api';

export interface User {
  id: string;
  email: string;
  name: string;
  surname: string;
  avatar?: string;
  companyId: string;
  companyName: string;
  roles: string[];
  permissions: string[];
}

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginMfa: (code: string, token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const { user, setUser, clearAuth, setTokens } = useAuthStore();

  const login = useCallback(async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { accessToken, refreshToken, user: userData } = response.data;
    setTokens(accessToken, refreshToken);
    setUser(userData);
  }, [setUser, setTokens]);

  const loginMfa = useCallback(async (code: string, token: string) => {
    const response = await api.post('/auth/login/mfa', { code, token });
    const { accessToken, refreshToken, user: userData } = response.data;
    setTokens(accessToken, refreshToken);
    setUser(userData);
  }, [setUser, setTokens]);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  const refreshToken = useCallback(async () => {
    try {
      const refresh = useAuthStore.getState().refreshToken;
      if (!refresh) throw new Error('No refresh token');
      const response = await api.post('/auth/refresh', { refreshToken: refresh });
      const { accessToken, refreshToken: newRefresh, user: userData } = response.data;
      setTokens(accessToken, newRefresh);
      if (userData) setUser(userData);
    } catch {
      clearAuth();
    }
  }, [setUser, setTokens, clearAuth]);

  useEffect(() => {
    const init = async () => {
      try {
        await refreshToken();
      } catch {
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [refreshToken, clearAuth]);

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginMfa,
    logout,
    refreshToken,
  }), [user, isLoading, login, loginMfa, logout, refreshToken]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

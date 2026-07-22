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
    // Mocked login to allow frontend access without backend
    console.warn("Using mocked login bypass due to network errors.");
    const access_token = "mock_access_token";
    const refresh_token = "mock_refresh_token";
    
    setTokens(access_token, refresh_token);
    
    setUser({
      id: "usr_mock123",
      email: email,
      name: "Admin",
      surname: "User",
      companyId: "comp_1",
      companyName: "Demo Company",
      roles: ["admin"],
      permissions: ["*"],
    });
  }, [setUser, setTokens]);

  const loginMfa = useCallback(async (code: string, token: string) => {
    const access_token = "mock_access_token";
    const refresh_token = "mock_refresh_token";
    setTokens(access_token, refresh_token);
    setUser({
      id: "usr_mock123",
      email: "mock@example.com",
      name: "Admin",
      surname: "User",
      companyId: "comp_1",
      companyName: "Demo Company",
      roles: ["admin"],
      permissions: ["*"],
    });
  }, [setUser, setTokens]);

  const logout = useCallback(async () => {
    try {
      // await api.post('/auth/logout');
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  const refreshToken = useCallback(async () => {
    try {
      const refresh = useAuthStore.getState().refreshToken;
      if (!refresh) throw new Error('No refresh token');
      // const response = await api.post('/auth/refresh', { refresh_token: refresh });
      // const { access_token, refresh_token: newRefresh } = response.data;
      const access_token = "mock_access_token";
      const newRefresh = "mock_refresh_token";
      setTokens(access_token, newRefresh);
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

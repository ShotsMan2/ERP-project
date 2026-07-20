import { create } from 'zustand';
import type { User } from '@/providers/AuthProvider';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  permissions: string[];
  setUser: (user: User) => void;
  setTokens: (access: string, refresh: string) => void;
  setPermissions: (permissions: string[]) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  permissions: [],
  setUser: (user) => set({ user }),
  setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
  setPermissions: (permissions) => set({ permissions }),
  clearAuth: () =>
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      permissions: [],
    }),
}));

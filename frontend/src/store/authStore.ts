import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthResponse } from '@/types';
import api from '@/lib/api';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setAuth: (data: AuthResponse) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (data: AuthResponse) => {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        set({ user: data.user, accessToken: data.accessToken, isAuthenticated: true });
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          set({ user: data.user, accessToken: data.accessToken, isAuthenticated: true });
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password });
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          set({ user: data.user, accessToken: data.accessToken, isAuthenticated: true });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
    }),
    { name: 'auth-storage', partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }) }
  )
);

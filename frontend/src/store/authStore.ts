import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, AuthResponse } from '@/types';
import api from '@/lib/api';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  _setAuth: (data: AuthResponse) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      _setAuth: (data: AuthResponse) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
        }
        set({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
          }
          set({
            user: data.user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password });
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
          }
          set({
            user: data.user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'expense-tracker-auth',
      storage: createJSONStorage(() => localStorage),
      // Persist everything including tokens for long sessions
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

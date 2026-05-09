import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Attach token from localStorage on every request
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    // Try Zustand persisted store first, fallback to direct localStorage
    let token = localStorage.getItem('accessToken');
    if (!token) {
      try {
        const stored = localStorage.getItem('expense-tracker-auth');
        if (stored) token = JSON.parse(stored)?.state?.accessToken;
      } catch {}
    }
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        let refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          const stored = localStorage.getItem('expense-tracker-auth');
          if (stored) refreshToken = JSON.parse(stored)?.state?.refreshToken;
        }
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });

        // Update localStorage
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        // Update Zustand store
        try {
          const stored = localStorage.getItem('expense-tracker-auth');
          if (stored) {
            const parsed = JSON.parse(stored);
            parsed.state.accessToken = data.accessToken;
            parsed.state.refreshToken = data.refreshToken;
            localStorage.setItem('expense-tracker-auth', JSON.stringify(parsed));
          }
        } catch {}

        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        // Refresh failed — clear everything and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('expense-tracker-auth');
        if (typeof window !== 'undefined') window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

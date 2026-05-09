import { create } from 'zustand';
import { Budget, DashboardData } from '@/types';
import api from '@/lib/api';

interface BudgetState {
  budget: Budget | null;
  dashboard: DashboardData | null;
  isLoading: boolean;
  isSaving: boolean;
  fetchBudget: (month: number, year: number) => Promise<void>;
  fetchDashboard: () => Promise<void>;
  saveBudget: (data: unknown) => Promise<Budget>;
}

export const useBudgetStore = create<BudgetState>((set) => ({
  budget: null,
  dashboard: null,
  isLoading: false,
  isSaving: false,

  fetchBudget: async (month, year) => {
    set({ isLoading: true });
    try {
      const { data } = await api.get<Budget>(`/budgets/${year}/${month}`);
      set({ budget: data });
    } catch {
      set({ budget: null });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchDashboard: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get<DashboardData>('/dashboard');
      set({ dashboard: data });
    } finally {
      set({ isLoading: false });
    }
  },

  saveBudget: async (budgetData) => {
    set({ isSaving: true });
    try {
      const { data } = await api.post<Budget>('/budgets', budgetData);
      set({ budget: data });
      return data;
    } finally {
      set({ isSaving: false });
    }
  },
}));

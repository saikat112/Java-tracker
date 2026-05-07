import { create } from 'zustand';
import { Expense, PageResponse, Category } from '@/types';
import api from '@/lib/api';

interface ExpenseState {
  expenses: Expense[];
  categories: Category[];
  totalElements: number;
  currentPage: number;
  isLoading: boolean;
  fetchExpenses: (month?: number, year?: number, page?: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
  addExpense: (data: Partial<Expense> & { categoryId?: string }) => Promise<void>;
  updateExpense: (id: string, data: Partial<Expense> & { categoryId?: string }) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
}

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expenses: [],
  categories: [],
  totalElements: 0,
  currentPage: 0,
  isLoading: false,

  fetchExpenses: async (month, year, page = 0) => {
    set({ isLoading: true });
    try {
      const params = new URLSearchParams({ page: String(page), size: '20' });
      if (month) params.append('month', String(month));
      if (year) params.append('year', String(year));
      const { data } = await api.get<PageResponse<Expense>>(`/expenses?${params}`);
      set({ expenses: data.content, totalElements: data.totalElements, currentPage: page });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCategories: async () => {
    const { data } = await api.get<Category[]>('/categories');
    set({ categories: data });
  },

  addExpense: async (expenseData) => {
    await api.post('/expenses', expenseData);
    get().fetchExpenses();
  },

  updateExpense: async (id, expenseData) => {
    await api.put(`/expenses/${id}`, expenseData);
    get().fetchExpenses();
  },

  deleteExpense: async (id) => {
    await api.delete(`/expenses/${id}`);
    set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) }));
  },
}));

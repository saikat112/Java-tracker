import { create } from 'zustand';
import { Group, GroupExpense, SettlementSummary, PageResponse } from '@/types';
import api from '@/lib/api';

interface GroupState {
  groups: Group[];
  currentGroup: Group | null;
  groupExpenses: GroupExpense[];
  settlementSummary: SettlementSummary | null;
  isLoading: boolean;
  fetchGroups: () => Promise<void>;
  fetchGroup: (id: string) => Promise<void>;
  createGroup: (data: { name: string; description?: string; memberEmails?: string[] }) => Promise<Group>;
  addMember: (groupId: string, email: string) => Promise<void>;
  removeMember: (groupId: string, memberId: string) => Promise<void>;
  fetchGroupExpenses: (groupId: string, page?: number) => Promise<void>;
  addGroupExpense: (groupId: string, data: unknown) => Promise<void>;
  fetchSettlements: (groupId: string) => Promise<void>;
  recordSettlement: (groupId: string, receiverId: string, amount: number, notes?: string) => Promise<void>;
}

export const useGroupStore = create<GroupState>((set, get) => ({
  groups: [],
  currentGroup: null,
  groupExpenses: [],
  settlementSummary: null,
  isLoading: false,

  fetchGroups: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get<Group[]>('/groups');
      set({ groups: data });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchGroup: async (id) => {
    const { data } = await api.get<Group>(`/groups/${id}`);
    set({ currentGroup: data });
  },

  createGroup: async (groupData) => {
    const { data } = await api.post<Group>('/groups', groupData);
    set((state) => ({ groups: [...state.groups, data] }));
    return data;
  },

  addMember: async (groupId, email) => {
    await api.post(`/groups/${groupId}/members`, { email });
    get().fetchGroup(groupId);
  },

  removeMember: async (groupId, memberId) => {
    await api.delete(`/groups/${groupId}/members/${memberId}`);
    get().fetchGroup(groupId);
  },

  fetchGroupExpenses: async (groupId, page = 0) => {
    const { data } = await api.get<PageResponse<GroupExpense>>(`/groups/${groupId}/expenses?page=${page}`);
    set({ groupExpenses: data.content });
  },

  addGroupExpense: async (groupId, expenseData) => {
    await api.post(`/groups/${groupId}/expenses`, expenseData);
    get().fetchGroupExpenses(groupId);
  },

  fetchSettlements: async (groupId) => {
    const { data } = await api.get<SettlementSummary>(`/groups/${groupId}/settlements`);
    set({ settlementSummary: data });
  },

  recordSettlement: async (groupId, receiverId, amount, notes) => {
    await api.post(`/groups/${groupId}/settlements`, { receiverId, amount, notes });
    get().fetchSettlements(groupId);
  },
}));

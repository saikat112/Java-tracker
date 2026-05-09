export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: User;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  notes?: string;
  paymentMethod: PaymentMethod;
  expenseDate: string;
  weekNumber?: number;
  category?: Category;
  createdAt?: string;
  updatedAt?: string;
}

export type PaymentMethod = 'CASH' | 'CARD' | 'UPI' | 'NET_BANKING' | 'WALLET';

export interface FixedExpense {
  id: string;
  name: string;
  amount: number;
  categoryName?: string;
}

export interface WeeklyBudget {
  weekNumber: number;
  weeklyBudget: number;
  totalSpent: number;
  remaining: number;
  status: 'HEALTHY' | 'WARNING' | 'OVER';
}

export interface Budget {
  id: string;
  month: number;
  year: number;
  totalBudget: number;
  fixedExpensesTotal: number;
  savingsGoal: number;
  flexibleBudget: number;
  totalSpent: number;
  remainingBudget: number;
  fixedExpenses: FixedExpense[];
  weeklyBreakdown: WeeklyBudget[];
}

export interface DashboardData {
  budget?: {
    totalBudget: number;
    fixedExpenses: number;
    flexibleBudget: number;
    totalSpent: number;
    remaining: number;
    healthStatus: 'HEALTHY' | 'WARNING' | 'OVER_BUDGET';
  };
  currentWeek?: {
    weekNumber: number;
    weeklyBudget: number;
    spent: number;
    remaining: number;
    dailySafeSpend: number;
    daysLeft: number;
  };
  categoryBreakdown: CategorySpend[];
  weeklyTrends: WeeklyTrend[];
  savingsPrediction: number;
}

export interface CategorySpend {
  category: string;
  icon?: string;
  color?: string;
  amount: number;
  percentage: number;
}

export interface WeeklyTrend {
  week: number;
  budget: number;
  spent: number;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  createdBy: User;
  members: GroupMember[];
  totalExpenses: number;
  memberCount: number;
}

export interface GroupMember {
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'ADMIN' | 'MEMBER';
}

export interface GroupExpense {
  id: string;
  title: string;
  amount: number;
  notes?: string;
  expenseDate: string;
  paidBy: User;
  category?: Category;
  splitType: 'EQUAL' | 'CUSTOM';
  splits: SplitDetail[];
}

export interface SplitDetail {
  userId: string;
  userName: string;
  shareAmount: number;
  isSettled: boolean;
}

export interface MemberBalance {
  userId: string;
  name: string;
  totalPaid: number;
  equalShare: number;
  balance: number;
}

export interface SettlementTransaction {
  payerId: string;
  payerName: string;
  receiverId: string;
  receiverName: string;
  amount: number;
}

export interface SettlementSummary {
  groupId: string;
  groupName: string;
  totalExpenses: number;
  balances: MemberBalance[];
  suggestedSettlements: SettlementTransaction[];
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

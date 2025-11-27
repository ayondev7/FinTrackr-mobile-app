export interface User {
  id: string;
  name: string;
  email?: string;
  image?: string;
  currency: string;
  cashBalance: number;
  bankBalance: number;
  digitalBalance: number;
  theme: 'light' | 'dark';
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface UpdateBalancePayload {
  cashBalance: number;
  bankBalance: number;
  digitalBalance: number;
  currency?: string;
}

export interface UpdateProfilePayload {
  name?: string;
  currency?: string;
  theme?: 'light' | 'dark';
}

export interface ClearDataResult {
  deletedTransactions: number;
  deletedBudgets: number;
  deletedCategories: number;
}

export interface ExportTransaction {
  id: string;
  amount: number;
  type: 'expense' | 'revenue';
  category: string;
  categoryIcon: string;
  accountType: string;
  name?: string;
  description?: string;
  date: string;
  createdAt: string;
}

export interface ExportData {
  exportedAt: string;
  profile: {
    name: string;
    email: string;
    currency: string;
  };
  balances: {
    cash: number;
    bank: number;
    digital: number;
    total: number;
  };
  transactions: ExportTransaction[];
  summary: {
    totalTransactions: number;
    totalExpenses: number;
    totalRevenue: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  currentBalance: number;
  currency: string;
  createdAt: string;
}

export interface Wallet {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'card' | 'investment';
  balance: number;
  currency: string;
  color: string;
  icon: string;
}

export interface Transaction {
  id: string;
  type: 'expense' | 'revenue';
  amount: number;
  category: string;
  categoryId: string;
  description: string;
  date: string;
  walletId: string;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  type: 'expense' | 'revenue' | 'both';
  color: string;
  icon: string;
  budget?: number;
  isPinned?: boolean;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: 'monthly' | 'weekly' | 'yearly';
  spent: number;
  startDate: string;
  endDate: string;
}

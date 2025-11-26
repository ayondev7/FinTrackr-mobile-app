import { Transaction } from './transaction';

export interface DashboardUser {
  id: string;
  name: string;
  currency: string;
  currentBalance: number;
  initialBalance: number;
}

export interface MonthlyStats {
  totalExpense: number;
  totalRevenue: number;
  netIncome: number;
  prevMonthExpense: number;
  prevMonthRevenue: number;
  balanceChangePercent: number;
}

export interface DashboardTransaction extends Transaction {
  categoryIcon?: string;
  categoryColor?: string;
  walletId?: string | null;
}

export interface DashboardSummary {
  user: DashboardUser;
  monthlyStats: MonthlyStats;
  recentTransactions: DashboardTransaction[];
}

export interface MonthlyStatsParams {
  month?: number;
  year?: number;
}

export interface RecentTransactionsParams {
  limit?: number;
}

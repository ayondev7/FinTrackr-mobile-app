export type AnalyticsType = 'expense' | 'revenue' | 'both';

export interface AnalyticsParams {
  startDate?: string;
  endDate?: string;
  type?: AnalyticsType;
}

export interface AnalyticsStats {
  totalExpense: number;
  totalRevenue: number;
  netIncome: number;
  expenseCount: number;
  revenueCount: number;
  totalTransactions: number;
  averageExpense: number;
  averageRevenue: number;
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  categoryType: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface AnalyticsData {
  stats: AnalyticsStats;
  categoryBreakdown: CategoryBreakdown[];
}

export interface MonthlyOverviewParams {
  year?: number;
}

export interface MonthlyOverviewItem {
  month: number;
  monthName: string;
  year: number;
  expense: number;
  revenue: number;
  netIncome: number;
}

export interface BalanceTrendParams {
  startDate?: string;
  endDate?: string;
  interval?: string;
}

export interface BalanceTrendItem {
  date: string;
  balance: number;
  change: number;
  type: string;
}

export interface CategoryStatsParams {
  startDate?: string;
  endDate?: string;
}

export interface CategoryStatsItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: string;
  totalAmount: number;
  transactionCount: number;
  averageAmount: number;
}

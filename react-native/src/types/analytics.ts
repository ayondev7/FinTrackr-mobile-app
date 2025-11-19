export interface DailySummary {
  date: string;
  totalExpense: number;
  totalRevenue: number;
  balance: number;
}

export interface MonthlySummary {
  month: string;
  year: number;
  totalExpense: number;
  totalRevenue: number;
  balance: number;
  categoryBreakdown: CategoryBreakdown[];
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface Prediction {
  currentBalance: number;
  averageMonthlyExpense: number;
  averageMonthlyRevenue: number;
  estimatedMonthsLeft: number;
  projectedBalances: ProjectedBalance[];
  recommendations: string[];
}

export interface ProjectedBalance {
  month: string;
  estimatedBalance: number;
  status: 'healthy' | 'warning' | 'critical';
}

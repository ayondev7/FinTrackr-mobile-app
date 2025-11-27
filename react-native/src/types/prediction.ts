export type ProjectionStatus = 'healthy' | 'warning' | 'critical';

export interface ProjectedBalance {
  month: string;
  estimatedBalance: number;
  status: ProjectionStatus;
}

export interface PredictionsData {
  currentBalance: number;
  averageMonthlyExpense: number;
  averageMonthlyRevenue: number;
  averageMonthlyNet: number;
  estimatedMonthsLeft: number | null;
  projectedBalances: ProjectedBalance[];
  recommendations: string[];
}

export interface PredictionsParams {
  months?: number;
}

export type SpendingTrend = 'increasing' | 'decreasing' | 'stable';

export interface SpendingInsights {
  currentMonthSpending: number;
  previousMonthSpending: number;
  changePercentage: number;
  trend: SpendingTrend;
  currentTransactionCount: number;
  previousTransactionCount: number;
}

export interface Budget {
  id: string;
  categoryId: string;
  categoryName: string;
  limit: number;
  spent: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  alertThreshold: number;
}

export interface BudgetAlert {
  budgetId: string;
  message: string;
  percentage: number;
  severity: 'info' | 'warning' | 'danger';
}

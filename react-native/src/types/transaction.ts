export type TransactionType = 'expense' | 'revenue';
export type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type SortBy = 'date' | 'amount';
export type FilterType = 'all' | 'expense' | 'revenue';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  categoryId: string;
  categoryIcon?: string;
  categoryColor?: string;
  name?: string;
  description?: string;
  date: string;
  createdAt: string;
  isRecurring?: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface RecurringTransaction extends Transaction {
  isRecurring: true;
  recurringFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  nextDueDate: string;
}

export interface TransactionListParams {
  type?: FilterType;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  isRecurring?: boolean;
  timePeriod?: TimePeriod;
  sortBy?: SortBy;
  page?: number;
  limit?: number;
}

export interface TransactionPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface TransactionListResponse {
  transactions: Transaction[];
  pagination: TransactionPagination;
}

export interface TransactionStats {
  totalExpense: number;
  totalRevenue: number;
  netIncome: number;
  transactionCount: number;
}

export interface TransactionStatsParams {
  startDate?: string;
  endDate?: string;
  timePeriod?: TimePeriod;
}

export interface CreateTransactionPayload {
  type: TransactionType;
  amount: number;
  categoryId: string;
  name?: string;
  description?: string;
  date: string;
  isRecurring?: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  nextDueDate?: string;
}

export interface UpdateTransactionPayload extends Partial<CreateTransactionPayload> {}


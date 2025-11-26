export type TransactionType = 'expense' | 'revenue';
export type AccountType = 'CASH' | 'BANK' | 'DIGITAL';
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
  accountType: AccountType;
  name?: string;
  description?: string;
  date: string;
  createdAt: string;
}

export interface TransactionListParams {
  type?: FilterType;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
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
  accountType: AccountType;
  name?: string;
  description?: string;
  date: string;
}

export interface UpdateTransactionPayload extends Partial<CreateTransactionPayload> {}


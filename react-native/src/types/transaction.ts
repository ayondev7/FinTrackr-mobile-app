export type TransactionType = 'expense' | 'revenue';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  categoryId: string;
  name?: string;
  description?: string;
  date: string;
  createdAt: string;
  isRecurring?: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  wallet?: string;
}

export interface RecurringTransaction extends Transaction {
  isRecurring: true;
  recurringFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  nextDueDate: string;
}

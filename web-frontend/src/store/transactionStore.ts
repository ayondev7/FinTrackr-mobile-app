import { create } from 'zustand';
import { Transaction } from '../types';
import transactionsData from '../config/transactions.json';

interface TransactionState {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  clearTransactions: () => void;
  getTransactionsByCategory: (categoryId: string) => Transaction[];
  getTransactionsByType: (type: 'expense' | 'revenue') => Transaction[];
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: transactionsData as Transaction[],
  
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),
  
  updateTransaction: (id, updates) =>
    set((state) => ({
      transactions: state.transactions.map((txn) =>
        txn.id === id ? { ...txn, ...updates } : txn
      ),
    })),
  
  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((txn) => txn.id !== id),
    })),
  
  clearTransactions: () => set({ transactions: [] }),
  
  getTransactionsByCategory: (categoryId) => {
    return get().transactions.filter((txn) => txn.categoryId === categoryId);
  },
  
  getTransactionsByType: (type) => {
    return get().transactions.filter((txn) => txn.type === type);
  },
}));

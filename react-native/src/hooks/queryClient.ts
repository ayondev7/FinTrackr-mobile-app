import { QueryClient } from '@tanstack/react-query';
import { TransactionListParams, TransactionStatsParams } from '../types';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

export const queryKeys = {
  user: {
    profile: ['user', 'profile'] as const,
  },
  transaction: {
    list: (params?: TransactionListParams) => ['transaction', 'list', params] as const,
    infinite: (params?: Omit<TransactionListParams, 'page'>) => ['transaction', 'infinite', params] as const,
    detail: (id: string) => ['transaction', 'detail', id] as const,
    stats: (params?: TransactionStatsParams) => ['transaction', 'stats', params] as const,
  },
  category: {
    list: ['category', 'list'] as const,
    detail: (id: string) => ['category', 'detail', id] as const,
  },
  budget: {
    list: ['budget', 'list'] as const,
    detail: (id: string) => ['budget', 'detail', id] as const,
  },
  analytics: {
    overview: ['analytics', 'overview'] as const,
    spending: ['analytics', 'spending'] as const,
    income: ['analytics', 'income'] as const,
    trends: ['analytics', 'trends'] as const,
  },
  dashboard: {
    summary: ['dashboard', 'summary'] as const,
    recentTransactions: (limit?: number) => ['dashboard', 'recentTransactions', limit] as const,
    monthlyStats: (month?: number, year?: number) => ['dashboard', 'monthlyStats', month, year] as const,
  },
};


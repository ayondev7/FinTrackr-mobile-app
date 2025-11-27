import { QueryClient } from '@tanstack/react-query';
import { 
  TransactionListParams, 
  TransactionStatsParams, 
  PredictionsParams,
  AnalyticsParams,
  MonthlyOverviewParams,
  BalanceTrendParams,
  CategoryStatsParams,
} from '../types';

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
    data: (params?: AnalyticsParams) => ['analytics', 'data', params] as const,
    monthly: (params?: MonthlyOverviewParams) => ['analytics', 'monthly', params] as const,
    balanceTrend: (params?: BalanceTrendParams) => ['analytics', 'balanceTrend', params] as const,
    categoryStats: (params?: CategoryStatsParams) => ['analytics', 'categoryStats', params] as const,
  },
  dashboard: {
    summary: ['dashboard', 'summary'] as const,
    recentTransactions: (limit?: number) => ['dashboard', 'recentTransactions', limit] as const,
    monthlyStats: (month?: number, year?: number) => ['dashboard', 'monthlyStats', month, year] as const,
  },
  predictions: {
    data: (params?: PredictionsParams) => ['predictions', 'data', params] as const,
    insights: ['predictions', 'insights'] as const,
  },
};


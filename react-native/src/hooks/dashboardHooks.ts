import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../utils/apiClient';
import { dashboardRoutes } from '../routes';
import { queryKeys } from './queryClient';
import {
  ApiResponse,
  DashboardSummary,
  DashboardTransaction,
  MonthlyStats,
  MonthlyStatsParams,
  RecentTransactionsParams,
} from '../types';

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.summary,
    queryFn: () =>
      apiRequest.get<ApiResponse<DashboardSummary>>(dashboardRoutes.summary),
  });
};

export const useRecentTransactions = (params?: RecentTransactionsParams) => {
  return useQuery({
    queryKey: queryKeys.dashboard.recentTransactions(params?.limit),
    queryFn: () =>
      apiRequest.get<ApiResponse<DashboardTransaction[]>>(
        dashboardRoutes.recentTransactions,
        params
      ),
  });
};

export const useMonthlyStats = (params?: MonthlyStatsParams) => {
  return useQuery({
    queryKey: queryKeys.dashboard.monthlyStats(params?.month, params?.year),
    queryFn: () =>
      apiRequest.get<
        ApiResponse<
          MonthlyStats & {
            month: number;
            year: number;
            expenseCount: number;
            revenueCount: number;
          }
        >
      >(dashboardRoutes.monthlyStats, params),
  });
};

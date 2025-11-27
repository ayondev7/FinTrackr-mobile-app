import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../utils/apiClient';
import { analyticsRoutes } from '../routes';
import { queryKeys } from './queryClient';
import {
  ApiResponse,
  AnalyticsData,
  AnalyticsParams,
  MonthlyOverviewItem,
  MonthlyOverviewParams,
  BalanceTrendItem,
  BalanceTrendParams,
  CategoryStatsItem,
  CategoryStatsParams,
} from '../types';

export const useAnalytics = (params?: AnalyticsParams) => {
  return useQuery({
    queryKey: queryKeys.analytics.data(params),
    queryFn: () =>
      apiRequest.get<ApiResponse<AnalyticsData>>(
        analyticsRoutes.analytics,
        params
      ),
  });
};

export const useMonthlyOverview = (params?: MonthlyOverviewParams) => {
  return useQuery({
    queryKey: queryKeys.analytics.monthly(params),
    queryFn: () =>
      apiRequest.get<ApiResponse<MonthlyOverviewItem[]>>(
        analyticsRoutes.monthly,
        params
      ),
  });
};

export const useBalanceTrend = (params?: BalanceTrendParams) => {
  return useQuery({
    queryKey: queryKeys.analytics.balanceTrend(params),
    queryFn: () =>
      apiRequest.get<ApiResponse<BalanceTrendItem[]>>(
        analyticsRoutes.balanceTrend,
        params
      ),
  });
};

export const useCategoryStats = (params?: CategoryStatsParams) => {
  return useQuery({
    queryKey: queryKeys.analytics.categoryStats(params),
    queryFn: () =>
      apiRequest.get<ApiResponse<CategoryStatsItem[]>>(
        analyticsRoutes.categoryStats,
        params
      ),
  });
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../utils/apiClient';
import { budgetRoutes } from '../routes';
import { queryKeys } from './queryClient';
import { ApiResponse, Budget } from '../types';

export interface BudgetWithCategory extends Budget {
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  percentage: number;
  isOverBudget: boolean;
  needsAlert: boolean;
}

export interface BudgetListParams {
  period?: string;
  categoryId?: string;
}

export const useBudgets = (params?: BudgetListParams) => {
  return useQuery({
    queryKey: [...queryKeys.budget.list, params],
    queryFn: () =>
      apiRequest.get<ApiResponse<BudgetWithCategory[]>>(budgetRoutes.list, params),
  });
};

export const useBudget = (id: string) => {
  return useQuery({
    queryKey: queryKeys.budget.detail(id),
    queryFn: () =>
      apiRequest.get<ApiResponse<BudgetWithCategory>>(budgetRoutes.getById(id)),
    enabled: !!id,
  });
};

export interface CreateBudgetInput {
  categoryId: string;
  limit: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  alertThreshold?: number;
}

export const useCreateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBudgetInput) =>
      apiRequest.post<ApiResponse<Budget>>(budgetRoutes.create, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budget.list });
    },
  });
};

export interface UpdateBudgetInput {
  limit?: number;
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate?: string;
  endDate?: string;
  alertThreshold?: number;
}

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBudgetInput }) =>
      apiRequest.put<ApiResponse<Budget>>(budgetRoutes.update(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budget.list });
    },
  });
};

export const useDeleteBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiRequest.delete<ApiResponse<null>>(budgetRoutes.delete(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budget.list });
    },
  });
};

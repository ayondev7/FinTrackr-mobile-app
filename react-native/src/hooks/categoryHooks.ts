import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../utils/apiClient';
import { categoryRoutes, transactionRoutes } from '../routes';
import { queryKeys } from './queryClient';
import { ApiResponse, Category, TransactionListResponse } from '../types';

export interface CategoryWithCount extends Category {
  _count: {
    transactions: number;
  };
}

export interface CategoryListParams {
  type?: 'EXPENSE' | 'REVENUE';
}

export const useCategories = (params?: CategoryListParams) => {
  return useQuery({
    queryKey: [...queryKeys.category.list, params],
    queryFn: () =>
      apiRequest.get<ApiResponse<CategoryWithCount[]>>(categoryRoutes.list, params),
  });
};

export const usePinnedCategories = () => {
  const { data, ...rest } = useCategories();
  
  const pinnedCategories = data?.data?.filter((cat) => cat.isPinned) || [];
  
  return {
    ...rest,
    data: pinnedCategories,
  };
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: queryKeys.category.detail(id),
    queryFn: () =>
      apiRequest.get<ApiResponse<CategoryWithCount>>(categoryRoutes.getById(id)),
    enabled: !!id,
  });
};

export const useCategoryTransactions = (categoryId: string) => {
  return useQuery({
    queryKey: queryKeys.transaction.list({ categoryId }),
    queryFn: () =>
      apiRequest.get<ApiResponse<TransactionListResponse>>(transactionRoutes.list, { categoryId, limit: 100 }),
    enabled: !!categoryId,
  });
};

export interface CreateCategoryInput {
  name: string;
  icon: string;
  color: string;
  type: 'EXPENSE' | 'REVENUE';
  isPinned?: boolean;
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryInput) =>
      apiRequest.post<ApiResponse<Category>>(categoryRoutes.create, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.category.list });
    },
  });
};

export interface UpdateCategoryInput {
  name?: string;
  icon?: string;
  color?: string;
  type?: 'EXPENSE' | 'REVENUE';
  isPinned?: boolean;
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryInput }) =>
      apiRequest.put<ApiResponse<Category>>(categoryRoutes.update(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.category.list });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiRequest.delete<ApiResponse<null>>(categoryRoutes.delete(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.category.list });
      queryClient.invalidateQueries({ queryKey: queryKeys.transaction.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.budget.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
  });
};

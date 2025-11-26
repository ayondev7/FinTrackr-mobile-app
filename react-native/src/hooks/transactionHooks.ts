import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../utils/apiClient';
import { transactionRoutes } from '../routes';
import { queryKeys } from './queryClient';
import {
  ApiResponse,
  Transaction,
  TransactionListParams,
  TransactionListResponse,
  TransactionStats,
  TransactionStatsParams,
  CreateTransactionPayload,
  UpdateTransactionPayload,
} from '../types';

export const useTransactions = (params?: TransactionListParams) => {
  return useQuery({
    queryKey: queryKeys.transaction.list(params),
    queryFn: () =>
      apiRequest.get<ApiResponse<TransactionListResponse>>(
        transactionRoutes.list,
        params
      ),
  });
};

export const useInfiniteTransactions = (params?: Omit<TransactionListParams, 'page'>) => {
  return useInfiniteQuery({
    queryKey: queryKeys.transaction.infinite(params),
    queryFn: ({ pageParam = 1 }) =>
      apiRequest.get<ApiResponse<TransactionListResponse>>(
        transactionRoutes.list,
        { ...params, page: pageParam, limit: params?.limit || 15 }
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.data.pagination;
      return pagination.hasMore ? pagination.page + 1 : undefined;
    },
  });
};

export const useTransaction = (id: string) => {
  return useQuery({
    queryKey: queryKeys.transaction.detail(id),
    queryFn: () =>
      apiRequest.get<ApiResponse<Transaction>>(transactionRoutes.getById(id)),
    enabled: !!id,
  });
};

export const useTransactionStats = (params?: TransactionStatsParams) => {
  return useQuery({
    queryKey: queryKeys.transaction.stats(params),
    queryFn: () =>
      apiRequest.get<ApiResponse<TransactionStats>>(
        transactionRoutes.stats,
        params
      ),
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTransactionPayload) =>
      apiRequest.post<ApiResponse<Transaction>>(transactionRoutes.create, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transaction'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.summary });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTransactionPayload }) =>
      apiRequest.put<ApiResponse<Transaction>>(transactionRoutes.update(id), payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transaction'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.summary });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiRequest.delete<ApiResponse<null>>(transactionRoutes.delete(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transaction'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.summary });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile });
    },
  });
};

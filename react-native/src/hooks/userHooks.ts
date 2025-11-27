import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../utils/apiClient";
import { userRoutes } from "../routes";
import { queryKeys } from "./queryClient";
import {
  User,
  ApiResponse,
  UpdateBalancePayload,
  UpdateProfilePayload,
  ClearDataResult,
} from "../types";

export const useUserProfile = () => {
  return useQuery({
    queryKey: queryKeys.user.profile,
    queryFn: () => apiRequest.get<ApiResponse<User>>(userRoutes.profile),
  });
};

export const useUpdateBalance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateBalancePayload) =>
      apiRequest.put<ApiResponse<User>>(userRoutes.updateBalance, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile });
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      apiRequest.put<ApiResponse<User>>(userRoutes.updateProfile, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile });
    },
  });
};

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: () =>
      apiRequest.delete<ApiResponse<null>>(userRoutes.deleteAccount),
  });
};

export const useClearUserData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      apiRequest.delete<ApiResponse<ClearDataResult>>(userRoutes.clearData),
    onSuccess: () => {
      // Invalidate all queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile });
      queryClient.invalidateQueries({ queryKey: ['transaction'] });
      queryClient.invalidateQueries({ queryKey: ['category'] });
      queryClient.invalidateQueries({ queryKey: ['budget'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.summary });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['prediction'] });
    },
  });
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../utils/apiClient";
import { walletRoutes } from "../routes";
import { queryKeys } from "./queryClient";
import { Wallet, ApiResponse } from "../types";

export interface CreateWalletPayload {
  name: string;
  type: "cash" | "bank" | "digital";
  balance: number;
  icon: string;
  color: string;
}

export interface UpdateWalletPayload extends Partial<CreateWalletPayload> {}

export const useWallets = () => {
  return useQuery({
    queryKey: queryKeys.wallet.list,
    queryFn: () => apiRequest.get<ApiResponse<Wallet[]>>(walletRoutes.list),
  });
};

export const useWallet = (id: string) => {
  return useQuery({
    queryKey: queryKeys.wallet.detail(id),
    queryFn: () =>
      apiRequest.get<ApiResponse<Wallet>>(walletRoutes.getById(id)),
    enabled: !!id,
  });
};

export const useCreateWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateWalletPayload) =>
      apiRequest.post<ApiResponse<Wallet>>(walletRoutes.create, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.list });
    },
  });
};

export const useUpdateWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateWalletPayload;
    }) => apiRequest.put<ApiResponse<Wallet>>(walletRoutes.update(id), payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.list });
    },
  });
};

export const useDeleteWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiRequest.delete<ApiResponse<null>>(walletRoutes.delete(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.list });
    },
  });
};

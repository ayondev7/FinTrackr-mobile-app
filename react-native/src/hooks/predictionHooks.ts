import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../utils/apiClient';
import { predictionRoutes } from '../routes';
import { queryKeys } from './queryClient';
import {
  ApiResponse,
  PredictionsData,
  PredictionsParams,
  SpendingInsights,
} from '../types';

export const usePredictions = (params?: PredictionsParams) => {
  return useQuery({
    queryKey: queryKeys.predictions.data(params),
    queryFn: () =>
      apiRequest.get<ApiResponse<PredictionsData>>(
        predictionRoutes.predictions,
        params
      ),
  });
};

export const useSpendingInsights = () => {
  return useQuery({
    queryKey: queryKeys.predictions.insights,
    queryFn: () =>
      apiRequest.get<ApiResponse<SpendingInsights>>(predictionRoutes.insights),
  });
};

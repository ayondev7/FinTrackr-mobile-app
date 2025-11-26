import { QueryClient } from '@tanstack/react-query';

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
  wallet: {
    list: ['wallet', 'list'] as const,
    detail: (id: string) => ['wallet', 'detail', id] as const,
  },
  transaction: {
    list: ['transaction', 'list'] as const,
    detail: (id: string) => ['transaction', 'detail', id] as const,
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
};

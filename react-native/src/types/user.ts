export interface User {
  id: string;
  name: string;
  email?: string;
  image?: string;
  currency: string;
  cashBalance: number;
  bankBalance: number;
  digitalBalance: number;
  theme: 'light' | 'dark';
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface UpdateBalancePayload {
  cashBalance: number;
  bankBalance: number;
  digitalBalance: number;
  currency?: string;
}

export interface UpdateProfilePayload {
  name?: string;
  currency?: string;
  theme?: 'light' | 'dark';
}

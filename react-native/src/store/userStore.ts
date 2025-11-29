import { create } from 'zustand';
import { User } from '../types';
import userData from '../config/user.json';

interface UserState {
  user: User;
  updateBalance: (amount: number) => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useUserStore = create<UserState>((set) => {
  // Normalize legacy `user.json` shape into the `User` type
  const initialUser: User = {
    id: (userData as any)?.id ?? 'unknown',
    name: (userData as any)?.name ?? 'User',
    email: (userData as any)?.email,
    image: (userData as any)?.image,
    currency: (userData as any)?.currency ?? 'USD',
    cashBalance: (userData as any)?.currentBalance ?? (userData as any)?.initialBalance ?? 0,
    bankBalance: 0,
    digitalBalance: 0,
    theme: ((userData as any)?.theme as 'light' | 'dark') ?? 'light',
    createdAt: (userData as any)?.createdAt,
    updatedAt: (userData as any)?.updatedAt,
    notifyTransactions: true,
    notifyBudgetAlerts: true,
    notifyMonthlyReports: false,
  };

  return {
    user: initialUser,

    updateBalance: (amount) =>
      set((state) => ({
        user: {
          ...state.user,
          cashBalance: state.user.cashBalance + amount,
        },
      })),

    updateUser: (updates) =>
      set((state) => ({
        user: {
          ...state.user,
          ...updates,
        },
      })),
  };
});

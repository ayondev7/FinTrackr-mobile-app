import { create } from 'zustand';
import { User } from '../types';

interface UserState {
  user: User;
  updateBalance: (amount: number) => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useUserStore = create<UserState>((set) => {
  const initialUser: User = {
    id: '',
    name: 'User',
    email: undefined,
    image: undefined,
    currency: 'USD',
    cashBalance: 0,
    bankBalance: 0,
    digitalBalance: 0,
    theme: 'light',
    createdAt: undefined,
    updatedAt: undefined,
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

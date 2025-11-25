import { create } from 'zustand';
import { User } from '../types';
import userData from '../config/user.json';

interface UserState {
  user: User;
  updateBalance: (amount: number) => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: userData as User,
  
  updateBalance: (amount) =>
    set((state) => ({
      user: {
        ...state.user,
        currentBalance: state.user.currentBalance + amount,
      },
    })),
  
  updateUser: (updates) =>
    set((state) => ({
      user: {
        ...state.user,
        ...updates,
      },
    })),
}));

import { create } from 'zustand';
import { User, Wallet } from '../types';
import userData from '../config/user.json';
import walletsData from '../config/wallets.json';

interface UserState {
  user: User;
  wallets: Wallet[];
  updateBalance: (amount: number) => void;
  updateUser: (updates: Partial<User>) => void;
  updateWallet: (walletId: string, balance: number) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: userData as User,
  wallets: walletsData as Wallet[],
  
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
  
  updateWallet: (walletId, balance) =>
    set((state) => ({
      wallets: state.wallets.map((wallet) =>
        wallet.id === walletId ? { ...wallet, balance } : wallet
      ),
    })),
}));

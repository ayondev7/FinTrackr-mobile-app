import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingState {
  hasSeenOnboarding: boolean;
  isAuthenticated: boolean;
  setHasSeenOnboarding: (value: boolean) => void;
  setIsAuthenticated: (value: boolean) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasSeenOnboarding: false,
      isAuthenticated: false,
      setHasSeenOnboarding: (value: boolean) => set({ hasSeenOnboarding: value }),
      setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
      reset: () => set({ hasSeenOnboarding: false, isAuthenticated: false }),
    }),
    {
      name: 'onboarding-storage',
    }
  )
);

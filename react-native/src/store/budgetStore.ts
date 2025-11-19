import { create } from 'zustand';
import { Budget } from '../types';
import budgetsData from '../config/budgets.json';

interface BudgetState {
  budgets: Budget[];
  addBudget: (budget: Budget) => void;
  updateBudget: (id: string, updates: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  getBudgetByCategory: (categoryId: string) => Budget | undefined;
  getExceededBudgets: () => Budget[];
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  budgets: budgetsData as Budget[],
  
  addBudget: (budget) =>
    set((state) => ({
      budgets: [...state.budgets, budget],
    })),
  
  updateBudget: (id, updates) =>
    set((state) => ({
      budgets: state.budgets.map((budget) =>
        budget.id === id ? { ...budget, ...updates } : budget
      ),
    })),
  
  deleteBudget: (id) =>
    set((state) => ({
      budgets: state.budgets.filter((budget) => budget.id !== id),
    })),
  
  getBudgetByCategory: (categoryId) => {
    return get().budgets.find((budget) => budget.categoryId === categoryId);
  },
  
  getExceededBudgets: () => {
    return get().budgets.filter((budget) => budget.spent > budget.limit);
  },
}));

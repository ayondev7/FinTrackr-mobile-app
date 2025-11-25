import { create } from 'zustand';
import { Category } from '../types';
import categoriesData from '../config/categories.json';

interface CategoryState {
  categories: Category[];
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  getPinnedCategories: () => Category[];
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: categoriesData as Category[],
  
  addCategory: (category) =>
    set((state) => ({
      categories: [...state.categories, category],
    })),
  
  updateCategory: (id, updates) =>
    set((state) => ({
      categories: state.categories.map((cat) =>
        cat.id === id ? { ...cat, ...updates } : cat
      ),
    })),
  
  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((cat) => cat.id !== id),
    })),
  
  getPinnedCategories: () => {
    return get().categories.filter((cat) => cat.isPinned);
  },
}));

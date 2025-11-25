'use client';

import React from 'react';
import { BottomNav, FloatingActionButton } from '@/components/navigation';
import { useCategoryStore } from '@/store';
import { Folder, Plus } from 'lucide-react';
import { Card } from '@/components/shared';
import Link from 'next/link';

export default function CategoriesPage() {
  const { categories } = useCategoryStore();

  const expenseCategories = categories.filter(
    (cat) => cat.type === 'expense' || cat.type === 'both'
  );
  const revenueCategories = categories.filter(
    (cat) => cat.type === 'revenue' || cat.type === 'both'
  );

  const CategoryList = ({ title, categories, iconType }: any) => (
    <>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {categories.map((category: any) => (
          <Link key={category.id} href={`/categories/${category.id}`}>
            <Card className="p-4 cursor-pointer active:scale-95 transition-transform">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: `${category.color}20` }}
              >
                <Folder size={24} style={{ color: category.color }} />
              </div>
              <p
                className="font-semibold text-sm mb-1 truncate"
                style={{ color: category.color }}
              >
                {category.name}
              </p>
              {category.budget && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Budget: ${category.budget}
                </p>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </>
  );

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-32 max-w-2xl mx-auto">
        <div className="p-6 pt-16">
          <h1 className="text-gray-900 dark:text-white text-3xl font-bold mb-6">
            Categories
          </h1>

          <Link href="/categories/add">
            <Card className="mb-6 p-4 cursor-pointer active:scale-95 transition-transform">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                  <Plus size={24} color="#6366F1" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Add New Category
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Create a custom category
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <CategoryList
            title="Expense Categories"
            categories={expenseCategories}
            iconType="folder"
          />

          <CategoryList
            title="Revenue Categories"
            categories={revenueCategories}
            iconType="briefcase"
          />
        </div>
      </div>
      
      <BottomNav />
      <FloatingActionButton />
    </>
  );
}

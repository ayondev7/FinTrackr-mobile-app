import React from 'react';
import { Card } from '../shared';
import { Folder, Plus } from 'lucide-react';
import { useCategoryStore } from '@/store';
import Link from 'next/link';

export const QuickActions: React.FC = () => {
  const { getPinnedCategories } = useCategoryStore();
  const pinnedCategories = getPinnedCategories();

  if (pinnedCategories.length === 0) {
    return (
      <>
        <p className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Quick Access
        </p>
        <Link href="/categories">
          <Card className="p-6 items-center text-center cursor-pointer active:scale-95 transition-transform">
            <Plus size={32} color="#6B7280" className="mb-2 mx-auto" />
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Pin your favorite categories for quick access
            </p>
          </Card>
        </Link>
      </>
    );
  }

  return (
    <>
      <p className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Quick Access
      </p>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {pinnedCategories.map((category) => (
          <Link key={category.id} href={`/categories/${category.id}`}>
            <Card className="p-4 cursor-pointer active:scale-95 transition-transform">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                style={{ backgroundColor: `${category.color}20` }}
              >
                <Folder size={20} style={{ color: category.color }} />
              </div>
              <p
                className="font-semibold text-sm mb-1 truncate"
                style={{ color: category.color }}
              >
                {category.name}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                View Details
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
};

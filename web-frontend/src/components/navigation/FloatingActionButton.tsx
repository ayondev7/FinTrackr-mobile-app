'use client';

import React, { useState } from 'react';
import { Plus, X, Receipt, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useThemeStore } from '@/store';
import { colors } from '@/constants/theme';

export const FloatingActionButton: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const { theme } = useThemeStore();
  const themeColors = colors[theme];

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAddTransaction = () => {
    setIsExpanded(false);
    router.push('/transactions/add');
  };

  const handleAddCategory = () => {
    setIsExpanded(false);
    router.push('/categories/add');
  };

  return (
    <>
      {isExpanded && (
        <div
          onClick={toggleMenu}
          className="fixed inset-0 bg-black/20 z-40"
          style={{ bottom: '0px' }}
        />
      )}

      <div className="fixed right-5 bottom-[110px] flex flex-col items-center gap-3 z-50 max-w-2xl">
        <div
          className={`flex flex-col gap-3 transition-all duration-300 ${
            isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <button
            onClick={handleAddCategory}
            className="w-14 h-14 rounded-full bg-purple-600 flex items-center justify-center shadow-lg active:scale-90 transition-transform"
          >
            <Tag size={24} color="white" strokeWidth={2.5} />
          </button>

          <button
            onClick={handleAddTransaction}
            className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center shadow-lg active:scale-90 transition-transform"
          >
            <Receipt size={24} color="white" strokeWidth={2.5} />
          </button>
        </div>

        <button
          onClick={toggleMenu}
          className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all"
          style={{ backgroundColor: themeColors.primary }}
        >
          <div
            className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : 'rotate-0'}`}
          >
            {isExpanded ? (
              <X size={32} color="white" strokeWidth={2.5} />
            ) : (
              <Plus size={32} color="white" strokeWidth={2.5} />
            )}
          </div>
        </button>
      </div>
    </>
  );
};

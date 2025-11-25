'use client';

import React from 'react';
import { BottomNav, FloatingActionButton } from '@/components/navigation';
import { useThemeStore } from '@/store';
import { colors } from '@/constants/theme';
import { TrendingUp, AlertCircle } from 'lucide-react';

export default function PredictionsPage() {
  const { theme } = useThemeStore();
  const themeColors = colors[theme];

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-32 max-w-2xl mx-auto">
        <div className="p-6 pt-16">
          <h1 className="text-gray-900 dark:text-white text-3xl font-bold mb-4">
            Predictions
          </h1>

          <div className="bg-linear-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 mb-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={24} />
              <h2 className="text-xl font-bold">Financial Forecast</h2>
            </div>
            <p className="text-indigo-100 mb-4">
              Based on your spending patterns over the last 3 months
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-sm text-indigo-100 mb-1">Next Month</p>
                <p className="text-2xl font-bold">$4,320</p>
                <p className="text-xs text-indigo-200 mt-1">Expected Expenses</p>
              </div>
              <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-sm text-indigo-100 mb-1">Savings Goal</p>
                <p className="text-2xl font-bold">$680</p>
                <p className="text-xs text-indigo-200 mt-1">Projected Savings</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Spending Insights
            </h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Great Job on Groceries!
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You spent 15% less on groceries compared to last month
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Watch Your Dining Expenses
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Dining out increased by 25% this month
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    On Track for Savings Goal
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You're 80% of the way to your monthly savings target
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4 flex gap-3"
          >
            <AlertCircle size={20} className="text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-800 dark:text-yellow-500 mb-1">
                Budget Alert
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-600">
                You're approaching your monthly budget limit for Entertainment category
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <BottomNav />
      <FloatingActionButton />
    </>
  );
}

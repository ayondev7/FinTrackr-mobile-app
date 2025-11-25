'use client';

import React, { useState } from 'react';
import { BottomNav, FloatingActionButton } from '@/components/navigation';
import { useTransactionStore, useThemeStore, useUserStore } from '@/store';
import { colors } from '@/constants/theme';
import { BarChart3, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import { StatsCard } from '@/components/shared';

export default function AnalyticsPage() {
  const { transactions } = useTransactionStore();
  const { theme } = useThemeStore();
  const { user } = useUserStore();
  const themeColors = colors[theme];
  const isDark = theme === 'dark';
  
  const [analyticsType, setAnalyticsType] = useState<'expense' | 'revenue' | 'both'>('expense');

  const expenseData = transactions
    .filter((txn) => txn.type === 'expense')
    .reduce((acc: any[], txn) => {
      const existing = acc.find((item) => item.name === txn.category);
      if (existing) {
        existing.amount += txn.amount;
      } else {
        acc.push({ name: txn.category, amount: txn.amount });
      }
      return acc;
    }, []);

  const revenueData = transactions
    .filter((txn) => txn.type === 'revenue')
    .reduce((acc: any[], txn) => {
      const existing = acc.find((item) => item.name === txn.category);
      if (existing) {
        existing.amount += txn.amount;
      } else {
        acc.push({ name: txn.category, amount: txn.amount });
      }
      return acc;
    }, []);

  const totalExpenses = transactions
    .filter((txn) => txn.type === 'expense')
    .reduce((sum, txn) => sum + txn.amount, 0);

  const totalRevenue = transactions
    .filter((txn) => txn.type === 'revenue')
    .reduce((sum, txn) => sum + txn.amount, 0);

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-32 max-w-2xl mx-auto">
        <div className="p-6 pt-16">
          <h1 className="text-gray-900 dark:text-white text-3xl font-bold mb-4">
            Analytics
          </h1>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setAnalyticsType('expense')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-colors ${
                analyticsType === 'expense'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setAnalyticsType('revenue')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-colors ${
                analyticsType === 'revenue'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setAnalyticsType('both')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-colors ${
                analyticsType === 'both'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Both
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <StatsCard
              title="Total Transactions"
              value={transactions.length.toString()}
              icon={<BarChart3 size={20} color={themeColors.primary} />}
              color={themeColors.primary}
            />
            <StatsCard
              title="Expenses"
              value={`$${totalExpenses.toFixed(0)}`}
              icon={<TrendingUp size={20} color={themeColors.danger} />}
              color={themeColors.danger}
            />
            <StatsCard
              title="Revenue"
              value={`$${totalRevenue.toFixed(0)}`}
              icon={<TrendingUp size={20} color={themeColors.success} />}
              color={themeColors.success}
            />
            <StatsCard
              title="Balance"
              value={`$${user.currentBalance.toFixed(0)}`}
              icon={<PieChartIcon size={20} color={themeColors.info} />}
              color={themeColors.info}
            />
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              {analyticsType === 'expense' ? 'Expense' : analyticsType === 'revenue' ? 'Revenue' : 'All'} Distribution
            </h2>
            <div className="space-y-3">
              {(analyticsType === 'expense' ? expenseData : analyticsType === 'revenue' ? revenueData : [...expenseData, ...revenueData])
                .sort((a, b) => b.amount - a.amount)
                .slice(0, 6)
                .map((item, index) => {
                  const total = analyticsType === 'expense' ? totalExpenses : analyticsType === 'revenue' ? totalRevenue : totalExpenses + totalRevenue;
                  const percentage = (item.amount / total) * 100;
                  const categoryColor = Object.values(themeColors.chart)[index % 10];
                  
                  return (
                    <div key={item.name}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {item.name}
                        </span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          ${item.amount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: categoryColor,
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[40px] text-right">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
      
      <BottomNav />
      <FloatingActionButton />
    </>
  );
}

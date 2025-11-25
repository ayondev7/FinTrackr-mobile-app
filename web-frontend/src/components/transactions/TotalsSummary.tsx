import React from 'react';
import { formatCurrency } from '@/utils';

interface TotalsSummaryProps {
  totalExpense: number;
  totalRevenue: number;
}

export const TotalsSummary: React.FC<TotalsSummaryProps> = ({
  totalExpense,
  totalRevenue,
}) => {
  return (
    <div className="flex justify-between items-center py-3 px-4 bg-gray-100 dark:bg-slate-700 rounded-2xl">
      <div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Revenue</p>
        <p className="text-lg font-bold text-green-500">
          {formatCurrency(totalRevenue, 'USD')}
        </p>
      </div>
      <div className="text-right">
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Expense</p>
        <p className="text-lg font-bold text-red-500">
          {formatCurrency(totalExpense, 'USD')}
        </p>
      </div>
    </div>
  );
};

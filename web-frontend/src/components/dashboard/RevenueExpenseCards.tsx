import React from 'react';
import { formatCurrency } from '@/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '../shared';

interface RevenueExpenseCardsProps {
  totalRevenue: number;
  totalExpense: number;
  currency: string;
  successColor: string;
  dangerColor: string;
}

export const RevenueExpenseCards: React.FC<RevenueExpenseCardsProps> = ({
  totalRevenue,
  totalExpense,
  currency,
  successColor,
  dangerColor,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <Card>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
          style={{ backgroundColor: `${successColor}20` }}
        >
          <TrendingUp size={20} style={{ color: successColor }} />
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Revenue</p>
        <p className="text-gray-900 dark:text-white text-2xl font-bold">
          {formatCurrency(totalRevenue, currency)}
        </p>
      </Card>

      <Card>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
          style={{ backgroundColor: `${dangerColor}20` }}
        >
          <TrendingDown size={20} style={{ color: dangerColor }} />
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Expense</p>
        <p className="text-gray-900 dark:text-white text-2xl font-bold">
          {formatCurrency(totalExpense, currency)}
        </p>
      </Card>
    </div>
  );
};

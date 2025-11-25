import React from 'react';
import { formatCurrency } from '@/utils';
import { Card } from '../shared';

interface CashFlowCardProps {
  totalRevenue: number;
  totalExpense: number;
  currency: string;
  primaryColor: string;
  successColor: string;
  dangerColor: string;
}

export const CashFlowCard: React.FC<CashFlowCardProps> = ({
  totalRevenue,
  totalExpense,
  currency,
  successColor,
  dangerColor,
}) => {
  const netCashFlow = totalRevenue - totalExpense;
  const revenuePercentage = totalRevenue > 0 ? (totalRevenue / (totalRevenue + totalExpense)) * 100 : 0;
  const expensePercentage = totalExpense > 0 ? (totalExpense / (totalRevenue + totalExpense)) * 100 : 0;

  return (
    <Card className="mb-6">
      <p className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Cash Flow
      </p>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
          <div
            className="h-full transition-all"
            style={{
              width: `${revenuePercentage}%`,
              backgroundColor: successColor,
            }}
          />
          <div
            className="h-full transition-all"
            style={{
              width: `${expensePercentage}%`,
              backgroundColor: dangerColor,
            }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: successColor }}
          />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Revenue: {formatCurrency(totalRevenue, currency)}
          </p>
        </div>
        <p className="text-xs text-gray-500">
          {revenuePercentage.toFixed(1)}%
        </p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: dangerColor }}
          />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Expense: {formatCurrency(totalExpense, currency)}
          </p>
        </div>
        <p className="text-xs text-gray-500">
          {expensePercentage.toFixed(1)}%
        </p>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Net Cash Flow
          </p>
          <p
            className={`text-xl font-bold ${
              netCashFlow >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {formatCurrency(netCashFlow, currency)}
          </p>
        </div>
      </div>
    </Card>
  );
};

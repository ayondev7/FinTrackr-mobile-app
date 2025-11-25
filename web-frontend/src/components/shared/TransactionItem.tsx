import React from 'react';
import { cn, formatCurrency, formatDate } from '@/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface TransactionItemProps {
  id: string;
  type: 'expense' | 'revenue';
  amount: number;
  category: string;
  description: string;
  date: string;
  color?: string;
  currency?: string;
  onClick?: () => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  type,
  amount,
  category,
  description,
  date,
  color = '#6366F1',
  currency = 'USD',
  onClick,
}) => {
  const isExpense = type === 'expense';
  
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl mb-3',
        onClick && 'cursor-pointer active:scale-95 transition-transform'
      )}
    >
      <div className="flex items-center gap-3 flex-1">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          {isExpense ? (
            <ArrowDownRight size={24} style={{ color }} />
          ) : (
            <ArrowUpRight size={24} style={{ color }} />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 dark:text-white truncate">
            {category}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {description}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {formatDate(date)}
          </p>
        </div>
      </div>
      
      <div className="text-right ml-3">
        <p
          className={cn(
            'font-bold text-lg',
            isExpense ? 'text-red-500' : 'text-green-500'
          )}
        >
          {isExpense ? '-' : '+'}{formatCurrency(amount, currency)}
        </p>
      </div>
    </div>
  );
};

import React from 'react';
import { ArrowUpDown } from 'lucide-react';

interface TransactionHeaderProps {
  count: number;
  sortBy: 'date' | 'amount';
  onToggleSort: () => void;
  primaryColor: string;
}

export const TransactionHeader: React.FC<TransactionHeaderProps> = ({
  count,
  sortBy,
  onToggleSort,
  primaryColor,
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        {count} {count === 1 ? 'transaction' : 'transactions'}
      </p>
      <button
        onClick={onToggleSort}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-slate-700 active:scale-95 transition-transform"
      >
        <ArrowUpDown size={16} style={{ color: primaryColor }} />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Sort by {sortBy}
        </span>
      </button>
    </div>
  );
};

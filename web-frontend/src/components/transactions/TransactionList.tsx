import React from 'react';
import { Transaction } from '@/types';
import { TransactionItem } from '../shared';

interface TransactionListProps {
  transactions: Transaction[];
  isDark: boolean;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
}) => {
  if (transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          No transactions found for this period
        </p>
      </div>
    );
  }

  return (
    <div>
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          {...transaction}
        />
      ))}
    </div>
  );
};

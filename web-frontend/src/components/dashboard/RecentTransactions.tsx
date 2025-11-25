import React from 'react';
import { Transaction } from '@/types';
import { TransactionItem } from '../shared';
import Link from 'next/link';

interface RecentTransactionsProps {
  transactions: Transaction[];
  primaryColor: string;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  primaryColor,
}) => {
  if (transactions.length === 0) {
    return (
      <>
        <p className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Recent Transactions
        </p>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No transactions yet
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-lg font-bold text-gray-900 dark:text-white">
          Recent Transactions
        </p>
        <Link
          href="/transactions"
          className="text-sm font-semibold"
          style={{ color: primaryColor }}
        >
          View All
        </Link>
      </div>
      <div>
        {transactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            {...transaction}
          />
        ))}
      </div>
    </>
  );
};

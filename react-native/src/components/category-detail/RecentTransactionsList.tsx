import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '../shared/Card';
import { formatCurrency } from '../../utils/helpers';

interface Transaction {
  id: string;
  name?: string;
  description?: string;
  date: string;
  amount: number;
  type: 'expense' | 'revenue';
}

interface RecentTransactionsListProps {
  transactions: Transaction[];
  categoryColor: string;
  currency: string;
}

export const RecentTransactionsList = ({ transactions, categoryColor, currency }: RecentTransactionsListProps) => {
  if (transactions.length === 0) {
    return (
      <View className="items-center justify-center py-12">
        <Text className="text-gray-400 dark:text-gray-500 text-base">
          No transactions yet
        </Text>
      </View>
    );
  }

  return (
    <>
      <Text className="text-gray-900 dark:text-white text-xl font-bold mb-4">
        Recent Transactions
      </Text>
      <View>
        {transactions.slice(0, 15).map((transaction) => (
          <Card key={transaction.id} className="mb-3 p-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-gray-900 dark:text-white font-semibold mb-1">
                  {transaction.name || 'Transaction'}
                </Text>
                {transaction.description && (
                  <Text className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                    {transaction.description}
                  </Text>
                )}
                <Text className="text-gray-400 dark:text-gray-500 text-xs">
                  {new Date(transaction.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
              </View>
              <Text 
                className="font-bold text-lg" 
                style={{ color: transaction.type === 'expense' ? '#EF4444' : categoryColor }}
              >
                {transaction.type === 'expense' ? '-' : '+'}
                {formatCurrency(transaction.amount, currency)}
              </Text>
            </View>
          </Card>
        ))}
      </View>
    </>
  );
};

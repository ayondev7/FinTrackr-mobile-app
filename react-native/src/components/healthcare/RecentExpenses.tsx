import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '../Card';
import { formatCurrency } from '../../utils/helpers';

interface Transaction {
  id: string;
  name?: string;
  description?: string;
  date: string;
  amount: number;
}

interface RecentExpensesProps {
  transactions: Transaction[];
  currency: string;
}

export const RecentExpenses = ({ transactions, currency }: RecentExpensesProps) => {
  return (
    <>
      <Text className="text-gray-900 dark:text-white text-xl font-bold mb-4">
        Recent Healthcare Expenses
      </Text>
      <View>
        {transactions.slice(0, 10).map((transaction) => (
          <Card key={transaction.id} className="mb-3 p-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-gray-900 dark:text-white font-semibold mb-1">
                  {transaction.name || 'Healthcare Expense'}
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
              <Text className="text-red-500 font-bold text-lg">
                {formatCurrency(transaction.amount, currency)}
              </Text>
            </View>
          </Card>
        ))}
      </View>
    </>
  );
};

import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '../shared/Card';
import { formatCurrency } from '../../utils/helpers';
import { Transaction } from '../../types';

interface RecentTransactionsListProps {
  transactions: Transaction[];
  categoryColor: string;
  currency: string;
}

const formatAccountType = (accountType: string) => {
  const accountTypeMap: Record<string, string> = {
    'CASH': 'Cash',
    'BANK': 'Bank',
    'DIGITAL': 'Digital',
  };
  return accountTypeMap[accountType] || accountType;
};

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
                <View className="flex-row items-center gap-2">
                  <Text className="text-gray-400 dark:text-gray-500 text-xs">
                    {new Date(transaction.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Text>
                  <Text className="text-gray-400 dark:text-gray-500 text-xs">•</Text>
                  <Text className="text-gray-400 dark:text-gray-500 text-xs">
                    {formatAccountType(transaction.accountType)}
                  </Text>
                </View>
              </View>
              <Text 
                className="font-bold text-lg" 
                style={{ color: transaction.type === 'expense' ? '#EF4444' : '#22C55E' }}
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

import React from 'react';
import { View, Text } from 'react-native';
import { FileText } from 'lucide-react-native';
import { TransactionItem } from '../shared/TransactionItem';
import { Transaction } from '../../types';

interface TransactionListProps {
  transactions: Transaction[];
  isDark: boolean;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, isDark }) => {
  if (transactions.length === 0) {
    return (
      <View className="items-center justify-center py-12">
        <FileText size={64} color={isDark ? '#4B5563' : '#D1D5DB'} />
        <Text className="text-gray-500 dark:text-gray-400 text-center mt-4">
          No transactions found
        </Text>
      </View>
    );
  }

  return (
    <>
      {transactions.map((transaction) => (
        <TransactionItem key={transaction.id} transaction={transaction} />
      ))}
    </>
  );
};

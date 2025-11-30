import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronRight } from 'lucide-react-native';
import { TransactionItem } from '../shared/TransactionItem';
import { Transaction } from '../../types';

interface RecentTransactionsProps {
  transactions: Transaction[];
  primaryColor: string;
  currency: string;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  primaryColor,
  currency,
}) => {
  const navigation = useNavigation();
  return (
    <>
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Transactions
        </Text>
        <TouchableOpacity className="flex-row items-center" onPress={() => navigation.navigate('Transactions' as never)}>
          <Text
            className="text-base font-medium mr-1"
            style={{ color: primaryColor }}
          >
            See All
          </Text>
          <ChevronRight size={16} color={primaryColor} />
        </TouchableOpacity>
      </View>

      {transactions.map((transaction) => (
        <TransactionItem key={transaction.id} transaction={transaction} currency={currency} />
      ))}
    </>
  );
};

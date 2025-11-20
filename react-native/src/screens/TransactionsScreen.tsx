import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TransactionItem } from '../components';
import { useTransactionStore, useThemeStore } from '../store';
import { colors } from '../constants/theme';
import { FileText } from 'lucide-react-native';

export const TransactionsScreen = () => {
  const insets = useSafeAreaInsets();
  const { transactions } = useTransactionStore();
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  const isDark = theme === 'dark';

  const [filterType, setFilterType] = useState<'all' | 'expense' | 'revenue'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  const filteredTransactions = transactions
    .filter((txn) => {
      if (filterType === 'all') return true;
      return txn.type === filterType;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return b.amount - a.amount;
    });

  const totalExpense = transactions
    .filter((txn) => txn.type === 'expense')
    .reduce((sum, txn) => sum + txn.amount, 0);

  const totalRevenue = transactions
    .filter((txn) => txn.type === 'revenue')
    .reduce((sum, txn) => sum + txn.amount, 0);

  return (
    <View className="flex-1 bg-gray-50 dark:bg-slate-900">
      <View className="p-4 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700" style={{ paddingTop: insets.top + 16 }}>
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Transactions
        </Text>

        <View className="flex-row gap-2 mb-4">
          <TouchableOpacity
            onPress={() => setFilterType('all')}
            className={`flex-1 py-2 px-4 rounded-xl ${
              filterType === 'all'
                ? 'bg-indigo-600 dark:bg-indigo-500'
                : 'bg-gray-100 dark:bg-slate-700'
            }`}
          >
            <Text
              className={`text-center font-medium ${
                filterType === 'all'
                  ? 'text-white'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilterType('expense')}
            className={`flex-1 py-2 px-4 rounded-xl ${
              filterType === 'expense'
                ? 'bg-red-500'
                : 'bg-gray-100 dark:bg-slate-700'
            }`}
          >
            <Text
              className={`text-center font-medium ${
                filterType === 'expense'
                  ? 'text-white'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              Expenses
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilterType('revenue')}
            className={`flex-1 py-2 px-4 rounded-xl ${
              filterType === 'revenue'
                ? 'bg-green-500'
                : 'bg-gray-100 dark:bg-slate-700'
            }`}
          >
            <Text
              className={`text-center font-medium ${
                filterType === 'revenue'
                  ? 'text-white'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              Revenue
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between">
          <View className="flex-1 mr-2">
            <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Total Expenses
            </Text>
            <Text className="text-base font-bold text-red-500">
              ${totalExpense.toFixed(2)}
            </Text>
          </View>
          <View className="flex-1 ml-2">
            <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Total Revenue
            </Text>
            <Text className="text-base font-bold text-green-500">
              ${totalRevenue.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-gray-600 dark:text-gray-400 text-sm">
            {filteredTransactions.length} transactions
          </Text>
          <TouchableOpacity
            onPress={() => setSortBy(sortBy === 'date' ? 'amount' : 'date')}
          >
            <Text
              className="text-sm font-medium"
              style={{ color: themeColors.primary }}
            >
              Sort by: {sortBy === 'date' ? 'Date' : 'Amount'}
            </Text>
          </TouchableOpacity>
        </View>

        {filteredTransactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}

        {filteredTransactions.length === 0 && (
          <View className="items-center justify-center py-12">
            <FileText size={64} color={isDark ? '#4B5563' : '#D1D5DB'} />
            <Text className="text-gray-500 dark:text-gray-400 text-center mt-4">
              No transactions found
            </Text>
          </View>
        )}

        <View className="h-6" />
      </ScrollView>
    </View>
  );
};

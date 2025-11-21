import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  TimePeriodFilter, 
  TypeFilter, 
  TotalsSummary, 
  TransactionHeader, 
  TransactionList 
} from '../components/transactions';
import { useTransactionStore, useThemeStore } from '../store';
import { colors } from '../constants/theme';

export const TransactionsScreen = () => {
  const insets = useSafeAreaInsets();
  const { transactions } = useTransactionStore();
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  const isDark = theme === 'dark';

  const [filterType, setFilterType] = useState<'all' | 'expense' | 'revenue'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [timePeriod, setTimePeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  const getDateRangeForPeriod = () => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (timePeriod) {
      case 'daily':
        return { start: startOfDay, end: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000) };
      case 'weekly':
        const startOfWeek = new Date(startOfDay);
        startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
        return { start: startOfWeek, end: new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000) };
      case 'monthly':
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        return { start: startOfMonth, end: endOfMonth };
      case 'yearly':
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
        return { start: startOfYear, end: endOfYear };
    }
  };

  const filteredTransactions = transactions
    .filter((txn) => {
      if (filterType !== 'all' && txn.type !== filterType) return false;
      
      const txnDate = new Date(txn.date);
      const { start, end } = getDateRangeForPeriod();
      return txnDate >= start && txnDate <= end;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return b.amount - a.amount;
    });

  const { start, end } = getDateRangeForPeriod();
  
  const totalExpense = transactions
    .filter((txn) => {
      const txnDate = new Date(txn.date);
      return txn.type === 'expense' && txnDate >= start && txnDate <= end;
    })
    .reduce((sum, txn) => sum + txn.amount, 0);

  const totalRevenue = transactions
    .filter((txn) => {
      const txnDate = new Date(txn.date);
      return txn.type === 'revenue' && txnDate >= start && txnDate <= end;
    })
    .reduce((sum, txn) => sum + txn.amount, 0);

  return (
    <View className="flex-1 bg-gray-50 dark:bg-slate-900">
      <View className="p-4 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700" style={{ paddingTop: insets.top + 16 }}>
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Transactions
        </Text>

        <TimePeriodFilter
          timePeriod={timePeriod}
          onSelect={setTimePeriod}
        />

        <TypeFilter
          filterType={filterType}
          onSelect={setFilterType}
        />

        <TotalsSummary
          totalExpense={totalExpense}
          totalRevenue={totalRevenue}
        />
      </View>

      <ScrollView 
        className="flex-1 p-4"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <TransactionHeader
          count={filteredTransactions.length}
          sortBy={sortBy}
          onToggleSort={() => setSortBy(sortBy === 'date' ? 'amount' : 'date')}
          primaryColor={themeColors.primary}
        />

        <TransactionList
          transactions={filteredTransactions}
          isDark={isDark}
        />
      </ScrollView>
    </View>
  );
};

import React from 'react';
import { View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  BalanceCard, 
  RevenueExpenseCards, 
  CashFlowCard, 
  QuickActions, 
  RecentTransactions 
} from '../components/dashboard';
import { useUserStore, useTransactionStore, useThemeStore } from '../store';
import { colors } from '../constants/theme';

export const DashboardScreen = () => {
  const insets = useSafeAreaInsets();
  const { user } = useUserStore();
  const { transactions } = useTransactionStore();
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  const isDark = theme === 'dark';

  const recentTransactions = transactions.slice(0, 5);

  const calculateTotals = () => {
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();

    const monthlyTransactions = transactions.filter((txn) => {
      const txnDate = new Date(txn.date);
      return txnDate.getMonth() === thisMonth && txnDate.getFullYear() === thisYear;
    });

    const totalExpense = monthlyTransactions
      .filter((txn) => txn.type === 'expense')
      .reduce((sum, txn) => sum + txn.amount, 0);

    const totalRevenue = monthlyTransactions
      .filter((txn) => txn.type === 'revenue')
      .reduce((sum, txn) => sum + txn.amount, 0);

    return { totalExpense, totalRevenue };
  };

  const { totalExpense, totalRevenue } = calculateTotals();

  return (
    <ScrollView 
      className="flex-1 bg-gray-50 dark:bg-slate-900"
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <View className="px-4" style={{ paddingTop: insets.top + 16 }}>
        <BalanceCard 
          balance={user.currentBalance}
          currency={user.currency}
          isDark={isDark}
        />

        <RevenueExpenseCards
          totalRevenue={totalRevenue}
          totalExpense={totalExpense}
          currency={user.currency}
          successColor={themeColors.success}
          dangerColor={themeColors.danger}
        />

        <CashFlowCard
          totalRevenue={totalRevenue}
          totalExpense={totalExpense}
          currency={user.currency}
          primaryColor={themeColors.primary}
          successColor={themeColors.success}
          dangerColor={themeColors.danger}
        />

        <QuickActions
          warningColor={themeColors.warning}
          dangerColor={themeColors.danger}
          infoColor={themeColors.info}
        />

        <RecentTransactions
          transactions={recentTransactions}
          primaryColor={themeColors.primary}
        />
      </View>
    </ScrollView>
  );
};

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
import { Loader } from '../components/shared';
import { useDashboardSummary } from '../hooks';
import { useThemeStore } from '../store';
import { colors } from '../constants/theme';

export const DashboardScreen = () => {
  const insets = useSafeAreaInsets();
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  const isDark = theme === 'dark';

  const { data: dashboardData, isLoading, error } = useDashboardSummary();

  if (isLoading) {
    return (
      <View 
        className="flex-1 bg-gray-50 dark:bg-slate-900 justify-center items-center"
        style={{ paddingTop: insets.top }}
      >
        <Loader size={64} />
      </View>
    );
  }

  const summary = dashboardData?.data;
  const user = summary?.user;
  const monthlyStats = summary?.monthlyStats;
  const recentTransactions = summary?.recentTransactions || [];

  const balance = user?.currentBalance ?? 0;
  const currency = user?.currency ?? 'USD';
  const totalExpense = monthlyStats?.totalExpense ?? 0;
  const totalRevenue = monthlyStats?.totalRevenue ?? 0;
  const balanceChangePercent = monthlyStats?.balanceChangePercent ?? 0;

  return (
    <ScrollView 
      className="flex-1 bg-gray-50 dark:bg-slate-900"
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <View className="px-4" style={{ paddingTop: insets.top + 16 }}>
        <BalanceCard 
          balance={balance}
          currency={currency}
          isDark={isDark}
          balanceChangePercent={balanceChangePercent}
        />

        <RevenueExpenseCards
          totalRevenue={totalRevenue}
          totalExpense={totalExpense}
          currency={currency}
          successColor={themeColors.success}
          dangerColor={themeColors.danger}
        />

        <CashFlowCard
          totalRevenue={totalRevenue}
          totalExpense={totalExpense}
          currency={currency}
          primaryColor={themeColors.primary}
          successColor={themeColors.success}
          dangerColor={themeColors.danger}
        />

        <QuickActions />

        <RecentTransactions
          transactions={recentTransactions}
          primaryColor={themeColors.primary}
        />
      </View>
    </ScrollView>
  );
};

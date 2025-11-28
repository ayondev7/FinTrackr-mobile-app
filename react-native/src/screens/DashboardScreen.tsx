import React from 'react';
import { View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  AccountTypeCards,
  RevenueExpenseCards, 
  CashFlowCard, 
  QuickActions, 
  RecentTransactions,
  BudgetOverview
} from '../components/dashboard';
import { Loader, RefreshableScrollView } from '../components/shared';
import { useDashboardSummary, useBudgets, useCategories } from '../hooks';
import { useThemeStore } from '../store';
import { colors } from '../constants/theme';

export const DashboardScreen = () => {
  const insets = useSafeAreaInsets();
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  const isDark = theme === 'dark';

  const { data: dashboardData, isLoading, error, refetch: refetchDashboard } = useDashboardSummary();
  const { refetch: refetchBudgets } = useBudgets();
  const { refetch: refetchCategories } = useCategories();

  const handleRefresh = async () => {
    await Promise.all([
      refetchDashboard(),
      refetchBudgets(),
      refetchCategories(),
    ]);
  };

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

  const balance = (user?.cashBalance || 0) + (user?.bankBalance || 0) + (user?.digitalBalance || 0);
  const currency = user?.currency ?? 'USD';
  const totalExpense = monthlyStats?.totalExpense ?? 0;
  const totalRevenue = monthlyStats?.totalRevenue ?? 0;
  const balanceChangePercent = monthlyStats?.balanceChangePercent ?? 0;

  return (
    <RefreshableScrollView 
      className="flex-1 bg-gray-50 dark:bg-slate-900"
      contentContainerStyle={{ paddingBottom: 100 }}
      onRefresh={handleRefresh}
    >
      <View style={{ paddingTop: insets.top + 16 }}>
        {/* Balance Cards - Horizontal Scroll with Total + Account Types */}
        <AccountTypeCards 
          currency={currency}
          totalBalance={balance}
          balanceChangePercent={balanceChangePercent}
          cashBalance={user?.cashBalance || 0}
          bankBalance={user?.bankBalance || 0}
          digitalBalance={user?.digitalBalance || 0}
        />
      </View>

      <View className="px-4">
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

        <BudgetOverview
          currency={currency}
          primaryColor={themeColors.warning}
        />

        <RecentTransactions
          transactions={recentTransactions}
          primaryColor={themeColors.primary}
          currency={currency}
        />
      </View>
    </RefreshableScrollView>
  );
};

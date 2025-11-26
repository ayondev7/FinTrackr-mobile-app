import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTransactionStore, useUserStore, useThemeStore } from '../store';
import { colors } from '../constants/theme';
import { RefreshableScrollView } from '../components/shared';
import { 
  BalanceTrendCard, 
  ProjectionChart, 
  AverageCards, 
  MonthlyBreakdown, 
  SmartInsights 
} from '../components/predictions';

export const PredictionsScreen = () => {
  const insets = useSafeAreaInsets();
  const { transactions } = useTransactionStore();
  const { user } = useUserStore();
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  const screenWidth = Dimensions.get('window').width;
  const isDark = theme === 'dark';

  const calculateAverages = () => {
    const expenses = transactions.filter((txn) => txn.type === 'expense');
    const totalExpense = expenses.reduce((sum, txn) => sum + txn.amount, 0);
    const avgMonthlyExpense = totalExpense / 6;

    const revenues = transactions.filter((txn) => txn.type === 'revenue');
    const totalRevenue = revenues.reduce((sum, txn) => sum + txn.amount, 0);
    const avgMonthlyRevenue = totalRevenue / 6;

    return { avgMonthlyExpense, avgMonthlyRevenue };
  };

  const { avgMonthlyExpense, avgMonthlyRevenue } = calculateAverages();
  const netMonthly = avgMonthlyRevenue - avgMonthlyExpense;
  const monthsLeft = user.currentBalance / avgMonthlyExpense;
  const isPositive = netMonthly >= 0;

  const projections = [
    { month: 'Dec', shortMonth: 'Dec', balance: user.currentBalance + netMonthly },
    { month: 'Jan', shortMonth: 'Jan', balance: user.currentBalance + netMonthly * 2 },
    { month: 'Feb', shortMonth: 'Feb', balance: user.currentBalance + netMonthly * 3 },
    { month: 'Mar', shortMonth: 'Mar', balance: user.currentBalance + netMonthly * 4 },
    { month: 'Apr', shortMonth: 'Apr', balance: user.currentBalance + netMonthly * 5 },
    { month: 'May', shortMonth: 'May', balance: user.currentBalance + netMonthly * 6 },
  ];

  const getStatus = (balance: number) => {
    if (balance >= user.currentBalance * 1.1) return 'healthy';
    if (balance >= user.currentBalance * 0.8) return 'warning';
    return 'critical';
  };

  const chartConfig = {
    backgroundColor: themeColors.card,
    backgroundGradientFrom: themeColors.card,
    backgroundGradientTo: themeColors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => isPositive 
      ? `rgba(16, 185, 129, ${opacity})` 
      : `rgba(239, 68, 68, ${opacity})`,
    labelColor: (opacity = 1) => isDark ? `rgba(241, 245, 249, ${opacity})` : `rgba(17, 24, 39, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "5",
      strokeWidth: "2",
      stroke: isPositive ? '#10B981' : '#EF4444'
    }
  };

  const handleRefresh = async () => {
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <RefreshableScrollView 
      className="flex-1 bg-gray-50 dark:bg-slate-900"
      onRefresh={handleRefresh}
    >
      <View className="p-6" style={{ paddingTop: insets.top + 24 }}>
        <Text className="text-gray-900 dark:text-white text-3xl font-bold mb-2">
          Financial Forecast
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 text-base mb-6">
          Your 6-month sustainability prediction
        </Text>

        <BalanceTrendCard
          isPositive={isPositive}
          isDark={isDark}
          netMonthly={netMonthly}
          currency={user.currency}
        />

        <ProjectionChart
          projections={projections}
          currentBalance={user.currentBalance}
          chartConfig={chartConfig}
          screenWidth={screenWidth}
        />

        <AverageCards
          avgMonthlyExpense={avgMonthlyExpense}
          avgMonthlyRevenue={avgMonthlyRevenue}
          netMonthly={netMonthly}
          isPositive={isPositive}
          currency={user.currency}
        />

        <MonthlyBreakdown
          projections={projections}
          currentBalance={user.currentBalance}
          netMonthly={netMonthly}
          currency={user.currency}
          getStatus={getStatus}
        />

        <SmartInsights
          isPositive={isPositive}
          netMonthly={netMonthly}
          projections={projections}
          currency={user.currency}
        />
      </View>
    </RefreshableScrollView>
  );
};

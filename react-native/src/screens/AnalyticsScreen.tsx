import React, { useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AnalyticsTypeFilter,
  StatsCardsGrid,
  MonthlyOverviewChart,
  BalanceTrendChart,
  DistributionChart,
} from '../components/analytics';
import { useThemeStore } from '../store';
import { colors } from '../constants/theme';
import { Loader, RefreshableScrollView } from '../components/shared';
import { useAnalytics, useMonthlyOverview, useUserProfile } from '../hooks';
import { AnalyticsType } from '../types';

export const AnalyticsScreen = () => {
  const insets = useSafeAreaInsets();
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  const screenWidth = Dimensions.get('window').width;
  const isDark = theme === 'dark';
  
  const [analyticsType, setAnalyticsType] = useState<AnalyticsType>('expense');

  const { data: analyticsResponse, isLoading: isLoadingAnalytics, refetch: refetchAnalytics } = useAnalytics({ type: analyticsType });
  const { data: monthlyResponse, isLoading: isLoadingMonthly, refetch: refetchMonthly } = useMonthlyOverview();
  const { data: userResponse } = useUserProfile();

  const analytics = analyticsResponse?.data;
  const monthlyData = monthlyResponse?.data ?? [];
  const user = userResponse?.data;
  const currency = user?.currency || 'USD';
  const currentBalance = (user?.cashBalance ?? 0) + (user?.bankBalance ?? 0) + (user?.digitalBalance ?? 0);

  const isLoading = isLoadingAnalytics || isLoadingMonthly;

  const handleRefresh = async () => {
    await Promise.all([refetchAnalytics(), refetchMonthly()]);
  };

  const chartConfig = {
    backgroundColor: themeColors.card,
    backgroundGradientFrom: themeColors.card,
    backgroundGradientTo: themeColors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => themeColors.primary,
    labelColor: (opacity = 1) => isDark ? `rgba(241, 245, 249, ${opacity})` : `rgba(17, 24, 39, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: themeColors.primary
    }
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

  const defaultStats = {
    totalExpense: 0,
    totalRevenue: 0,
    netIncome: 0,
    expenseCount: 0,
    revenueCount: 0,
    totalTransactions: 0,
    averageExpense: 0,
    averageRevenue: 0,
  };

  return (
    <RefreshableScrollView 
      className="flex-1 bg-gray-50 dark:bg-slate-900"
      contentContainerStyle={{ paddingBottom: 100 }}
      onRefresh={handleRefresh}
    >
      <View className="p-6" style={{ paddingTop: insets.top + 24 }}>
        <Text className="text-gray-900 dark:text-white text-3xl font-bold mb-4">
          Analytics
        </Text>

        <AnalyticsTypeFilter
          analyticsType={analyticsType}
          onSelect={setAnalyticsType}
        />

        <StatsCardsGrid
          stats={analytics?.stats ?? defaultStats}
          isDark={isDark}
          currency={currency}
        />

        <MonthlyOverviewChart
          screenWidth={screenWidth}
          analyticsType={analyticsType}
          chartConfig={chartConfig}
          monthlyData={monthlyData}
        />

        <BalanceTrendChart
          screenWidth={screenWidth}
          chartConfig={chartConfig}
          monthlyData={monthlyData}
          currentBalance={currentBalance}
        />

        <DistributionChart
          analyticsType={analyticsType}
          categoryBreakdown={analytics?.categoryBreakdown ?? []}
          chartConfig={chartConfig}
          isDark={isDark}
          chartColors={themeColors.chart}
          currency={currency}
        />
      </View>
    </RefreshableScrollView>
  );
};

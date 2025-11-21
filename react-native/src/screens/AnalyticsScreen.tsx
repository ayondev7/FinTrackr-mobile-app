import React, { useState } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AnalyticsTypeFilter,
  StatsCardsGrid,
  MonthlyOverviewChart,
  BalanceTrendChart,
  DistributionChart,
} from '../components/analytics';
import { useTransactionStore, useThemeStore, useUserStore } from '../store';
import { colors } from '../constants/theme';

export const AnalyticsScreen = () => {
  const insets = useSafeAreaInsets();
  const { transactions } = useTransactionStore();
  const { theme } = useThemeStore();
  const { user } = useUserStore();
  const themeColors = colors[theme];
  const screenWidth = Dimensions.get('window').width;
  const isDark = theme === 'dark';
  
  const [analyticsType, setAnalyticsType] = useState<'expense' | 'revenue' | 'both'>('expense');

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

  const getFilteredTransactions = () => {
    if (analyticsType === 'both') return transactions;
    return transactions.filter((txn) => txn.type === analyticsType);
  };

  const expenseData = transactions
    .filter((txn) => txn.type === 'expense')
    .reduce((acc: any[], txn) => {
      const existing = acc.find((item) => item.name === txn.category);
      if (existing) {
        existing.amount += txn.amount;
      } else {
        acc.push({ name: txn.category, amount: txn.amount });
      }
      return acc;
    }, []);

  const revenueData = transactions
    .filter((txn) => txn.type === 'revenue')
    .reduce((acc: any[], txn) => {
      const existing = acc.find((item) => item.name === txn.category);
      if (existing) {
        existing.amount += txn.amount;
      } else {
        acc.push({ name: txn.category, amount: txn.amount });
      }
      return acc;
    }, []);

  const getChartData = () => {
    let dataToUse = [];
    if (analyticsType === 'expense') {
      dataToUse = expenseData;
    } else if (analyticsType === 'revenue') {
      dataToUse = revenueData;
    } else {
      dataToUse = [...expenseData, ...revenueData];
    }
    return dataToUse;
  };

  const chartData = getChartData();
  const pieData = chartData.map((item, index) => ({
    name: item.name,
    amount: item.amount,
    color: Object.values(themeColors.chart)[index % 10],
    legendFontColor: isDark ? '#F1F5F9' : '#111827',
    legendFontSize: 12,
  }));

  return (
    <ScrollView 
      className="flex-1 bg-gray-50 dark:bg-slate-900"
      contentContainerStyle={{ paddingBottom: 100 }}
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
          transactionCount={transactions.length}
          isDark={isDark}
        />

        <MonthlyOverviewChart
          screenWidth={screenWidth}
          analyticsType={analyticsType}
          chartConfig={chartConfig}
        />

        <BalanceTrendChart
          screenWidth={screenWidth}
          chartConfig={chartConfig}
        />

        <DistributionChart
          analyticsType={analyticsType}
          pieData={pieData}
          chartData={chartData}
          chartConfig={chartConfig}
          isDark={isDark}
        />
      </View>
    </ScrollView>
  );
};

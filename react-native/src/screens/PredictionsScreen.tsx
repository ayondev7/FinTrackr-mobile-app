import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore } from '../store';
import { colors } from '../constants/theme';
import { Loader, RefreshableScrollView } from '../components/shared';
import { 
  BalanceTrendCard, 
  ProjectionChart, 
  AverageCards, 
  MonthlyBreakdown, 
  SmartInsights 
} from '../components/predictions';
import { usePredictions, useUserProfile } from '../hooks';

export const PredictionsScreen = () => {
  const insets = useSafeAreaInsets();
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  const screenWidth = Dimensions.get('window').width;
  const isDark = theme === 'dark';

  const { data: predictionsResponse, isLoading, refetch } = usePredictions({ months: 6 });
  const { data: userResponse } = useUserProfile();

  const predictions = predictionsResponse?.data;
  const user = userResponse?.data;
  const currency = user?.currency ?? 'USD';

  const isPositive = (predictions?.averageMonthlyNet ?? 0) >= 0;

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
    await refetch();
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

  if (!predictions) {
    return (
      <View 
        className="flex-1 bg-gray-50 dark:bg-slate-900 justify-center items-center"
        style={{ paddingTop: insets.top }}
      >
        <Text className="text-gray-500 dark:text-gray-400">
          Unable to load predictions
        </Text>
      </View>
    );
  }

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
          netMonthly={predictions.averageMonthlyNet}
          currency={currency}
        />

        <ProjectionChart
          projections={predictions.projectedBalances}
          currentBalance={predictions.currentBalance}
          chartConfig={chartConfig}
          screenWidth={screenWidth}
          currency={currency}
        />

        <AverageCards
          avgMonthlyExpense={predictions.averageMonthlyExpense}
          avgMonthlyRevenue={predictions.averageMonthlyRevenue}
          netMonthly={predictions.averageMonthlyNet}
          isPositive={isPositive}
          currency={currency}
        />

        <MonthlyBreakdown
          projections={predictions.projectedBalances}
          currentBalance={predictions.currentBalance}
          netMonthly={predictions.averageMonthlyNet}
          currency={currency}
        />

        <SmartInsights
          recommendations={predictions.recommendations}
          isPositive={isPositive}
        />
      </View>
    </RefreshableScrollView>
  );
};

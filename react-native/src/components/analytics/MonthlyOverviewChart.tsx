import React from 'react';
import { View, Text } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Card } from '../shared/Card';
import { MonthlyOverviewItem, AnalyticsType } from '../../types';

interface MonthlyOverviewChartProps {
  screenWidth: number;
  analyticsType: AnalyticsType;
  chartConfig: any;
  monthlyData: MonthlyOverviewItem[];
}

const formatCompactNumber = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}k`;
  }
  return Math.round(value).toString();
};

export const MonthlyOverviewChart: React.FC<MonthlyOverviewChartProps> = ({
  screenWidth,
  analyticsType,
  chartConfig,
  monthlyData,
}) => {
  const getChartColor = (opacity: number = 1) => {
    if (analyticsType === 'revenue') return `rgba(16, 185, 129, ${opacity})`;
    if (analyticsType === 'expense') return `rgba(239, 68, 68, ${opacity})`;
    return chartConfig.color(opacity);
  };

  const getChartData = () => {
    if (analyticsType === 'expense') {
      return monthlyData.map(item => item.expense);
    }
    if (analyticsType === 'revenue') {
      return monthlyData.map(item => item.revenue);
    }
    return monthlyData.map(item => item.expense + item.revenue);
  };

  const labels = monthlyData.map(item => item.monthName.substring(0, 3));
  const data = getChartData();

  const hasData = data.some(value => value > 0);

  return (
    <Card className="mb-6 p-4">
      <Text className="text-gray-900 dark:text-white text-lg font-bold mb-4">
        Monthly {analyticsType === 'expense' ? 'Expenses' : analyticsType === 'revenue' ? 'Revenue' : 'Overview'}
      </Text>
      {hasData ? (
        <BarChart
          data={{
            labels: labels.slice(-6),
            datasets: [{
              data: data.slice(-6).map(value => value || 0),
            }],
          }}
          width={screenWidth - 80}
          height={220}
          chartConfig={{
            ...chartConfig,
            fillShadowGradientFrom: getChartColor(0.5),
            fillShadowGradientTo: getChartColor(0.5),
            fillShadowGradientFromOpacity: 1,
            fillShadowGradientToOpacity: 1,
            color: () => getChartColor(0.5),
            propsForBackgroundLines: {
              strokeWidth: 0,
            },
          }}
          style={{
            borderRadius: 16,
          }}
          yAxisLabel=""
          yAxisSuffix=""
          fromZero
          showValuesOnTopOfBars
          withInnerLines={false}
        />
      ) : (
        <View className="h-[220] items-center justify-center">
          <Text className="text-gray-500 dark:text-gray-400">No data available</Text>
        </View>
      )}
    </Card>
  );
};

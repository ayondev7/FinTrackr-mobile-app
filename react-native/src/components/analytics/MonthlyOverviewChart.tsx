import React from 'react';
import { View, Text } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Card } from '../Card';

interface MonthlyOverviewChartProps {
  screenWidth: number;
  analyticsType: 'expense' | 'revenue' | 'both';
  chartConfig: any;
}

export const MonthlyOverviewChart: React.FC<MonthlyOverviewChartProps> = ({
  screenWidth,
  analyticsType,
  chartConfig,
}) => {
  const getChartColor = () => {
    if (analyticsType === 'revenue') return 'rgba(16, 185, 129, 1)';
    if (analyticsType === 'expense') return 'rgba(239, 68, 68, 1)';
    return chartConfig.color(1);
  };

  return (
    <Card className="mb-6 p-4">
      <Text className="text-gray-900 dark:text-white text-lg font-bold mb-4">
        Monthly {analyticsType === 'expense' ? 'Expenses' : analyticsType === 'revenue' ? 'Revenue' : 'Overview'}
      </Text>
      <BarChart
        data={{
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            data: [1200, 1500, 1800, 1300, 1600, 2000],
          }],
        }}
        width={screenWidth - 80}
        height={220}
        chartConfig={{
          ...chartConfig,
          color: (opacity = 1) => getChartColor().replace('1)', `${opacity})`),
          propsForBackgroundLines: {
            strokeWidth: 0,
          },
        }}
        style={{
          borderRadius: 16,
        }}
        yAxisLabel="$"
        yAxisSuffix=""
        fromZero
        showValuesOnTopOfBars
        withInnerLines={false}
      />
    </Card>
  );
};

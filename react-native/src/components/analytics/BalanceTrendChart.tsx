import React from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Card } from '../shared/Card';

interface BalanceTrendChartProps {
  screenWidth: number;
  chartConfig: any;
}

export const BalanceTrendChart: React.FC<BalanceTrendChartProps> = ({
  screenWidth,
  chartConfig,
}) => {
  return (
    <Card className="mb-6 p-4">
      <Text className="text-gray-900 dark:text-white text-lg font-bold mb-4">
        Balance Trend
      </Text>
      <LineChart
        data={{
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            data: [10000, 11000, 10500, 12000, 11800, 13000],
          }],
        }}
        width={screenWidth - 80}
        height={220}
        chartConfig={{
          ...chartConfig,
          color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
          propsForBackgroundLines: {
            strokeWidth: 0,
          },
        }}
        bezier
        style={{
          borderRadius: 16,
        }}
        yAxisLabel="$"
        withInnerLines={false}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines={false}
      />
    </Card>
  );
};

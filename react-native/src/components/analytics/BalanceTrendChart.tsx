import React from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Card } from '../shared/Card';
import { MonthlyOverviewItem } from '../../types';

interface BalanceTrendChartProps {
  screenWidth: number;
  chartConfig: any;
  monthlyData: MonthlyOverviewItem[];
  currentBalance: number;
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

export const BalanceTrendChart: React.FC<BalanceTrendChartProps> = ({
  screenWidth,
  chartConfig,
  monthlyData,
  currentBalance,
}) => {
  const calculateBalanceTrend = () => {
    let runningBalance = currentBalance;
    const balances: number[] = [];
    
    const reversedData = [...monthlyData].reverse();
    
    for (const month of reversedData) {
      runningBalance = runningBalance - month.netIncome;
      balances.unshift(runningBalance);
    }
    
    balances.push(currentBalance);
    
    return balances.slice(-7);
  };

  const balanceTrend = calculateBalanceTrend();
  const labels = [...monthlyData.slice(-6).map(item => item.monthName.substring(0, 3)), 'Now'];

  const hasData = balanceTrend.some(value => value !== 0);

  return (
    <Card className="mb-6 p-4">
      <Text className="text-gray-900 dark:text-white text-lg font-bold mb-4">
        Balance Trend
      </Text>
      {hasData ? (
        <LineChart
          data={{
            labels: labels,
            datasets: [{
              data: balanceTrend.map(value => Math.max(0, value)),
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
          yAxisLabel=""
          withInnerLines={false}
          withOuterLines={false}
          withVerticalLines={false}
          withHorizontalLines={false}
          formatYLabel={(value) => formatCompactNumber(parseFloat(value))}
        />
      ) : (
        <View className="h-[220] items-center justify-center">
          <Text className="text-gray-500 dark:text-gray-400">No data available</Text>
        </View>
      )}
    </Card>
  );
};

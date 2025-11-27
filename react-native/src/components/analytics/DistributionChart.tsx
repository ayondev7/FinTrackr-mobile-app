import React from 'react';
import { View, Text } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Card } from '../shared/Card';
import { formatAmount } from '../../utils/helpers';
import { CategoryBreakdown, AnalyticsType } from '../../types';

interface DistributionChartProps {
  analyticsType: AnalyticsType;
  categoryBreakdown: CategoryBreakdown[];
  chartConfig: any;
  isDark: boolean;
  chartColors: Record<string, string>;
}

export const DistributionChart: React.FC<DistributionChartProps> = ({
  analyticsType,
  categoryBreakdown,
  chartConfig,
  isDark,
  chartColors,
}) => {
  const getTitle = () => {
    if (analyticsType === 'expense') return 'Expense Distribution';
    if (analyticsType === 'revenue') return 'Revenue Distribution';
    return 'Transaction Distribution';
  };

  const getEmptyMessage = () => {
    if (analyticsType === 'both') return 'No transaction data available';
    return `No ${analyticsType} data available`;
  };

  const filteredData = analyticsType === 'both' 
    ? categoryBreakdown 
    : categoryBreakdown.filter(item => item.categoryType.toLowerCase() === analyticsType);

  const totalAmount = filteredData.reduce((sum, item) => sum + item.amount, 0);

  const pieData = filteredData.map((item, index) => ({
    name: item.categoryName,
    amount: item.amount,
    color: item.categoryColor || Object.values(chartColors)[index % 10],
    legendFontColor: isDark ? '#F1F5F9' : '#111827',
    legendFontSize: 12,
  }));

  return (
    <Card className="mb-6 p-4">
      <Text className="text-gray-900 dark:text-white text-lg font-bold mb-4">
        {getTitle()}
      </Text>
      {pieData.length > 0 ? (
        <View className="items-center">
          <View className="relative items-center justify-center" style={{ width: 220, height: 220 }}>
            <PieChart
              data={pieData}
              width={220}
              height={220}
              chartConfig={chartConfig}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="48"
              hasLegend={false}
              center={[0, -8]}
              absolute
            />
            <View 
              className="absolute w-32 h-32 bg-white dark:bg-slate-800 rounded-full items-center justify-center"
              style={{ pointerEvents: 'none', top: 46, left: 46 }}
            >
              <Text className="text-gray-500 dark:text-gray-400 text-xs">Total</Text>
              <Text className="text-gray-900 dark:text-white font-bold text-lg">
                ${formatAmount(totalAmount)}
              </Text>
            </View>
          </View>
          
          <View className="flex-row flex-wrap justify-center gap-3 mt-4">
            {pieData.map((item, index) => (
              <View key={index} className="flex-row items-center gap-2">
                <View 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }} 
                />
                <Text className="text-gray-600 dark:text-gray-300 text-xs">
                  {item.name} ({Math.round((item.amount / totalAmount) * 100)}%)
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <Text className="text-gray-500 text-center py-8">
          {getEmptyMessage()}
        </Text>
      )}
    </Card>
  );
};

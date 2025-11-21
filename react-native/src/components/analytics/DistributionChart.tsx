import React from 'react';
import { View, Text } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Card } from '../Card';

interface DistributionChartProps {
  analyticsType: 'expense' | 'revenue' | 'both';
  pieData: any[];
  chartData: any[];
  chartConfig: any;
  isDark: boolean;
}

export const DistributionChart: React.FC<DistributionChartProps> = ({
  analyticsType,
  pieData,
  chartData,
  chartConfig,
  isDark,
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
                ${chartData.reduce((sum, item) => sum + item.amount, 0).toFixed(0)}
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
                  {item.name} ({Math.round((item.amount / chartData.reduce((sum, i) => sum + i.amount, 0)) * 100)}%)
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

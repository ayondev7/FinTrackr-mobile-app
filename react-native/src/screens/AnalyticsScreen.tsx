import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { Card } from '../components';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { useTransactionStore, useThemeStore, useUserStore } from '../store';
import { colors } from '../constants/theme';

export const AnalyticsScreen = () => {
  const { transactions } = useTransactionStore();
  const { theme } = useThemeStore();
  const { user } = useUserStore();
  const themeColors = colors[theme];
  const screenWidth = Dimensions.get('window').width;
  const isDark = theme === 'dark';

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

  const pieData = expenseData.map((item, index) => ({
    name: item.name,
    amount: item.amount,
    color: Object.values(themeColors.chart)[index % 10],
    legendFontColor: isDark ? '#F1F5F9' : '#111827',
    legendFontSize: 12,
  }));

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-slate-900">
      <View className="p-6">
        <Text className="text-gray-900 dark:text-white text-3xl font-bold mb-6">
          Analytics
        </Text>

        <Card className="mb-6 p-4">
          <Text className="text-gray-900 dark:text-white text-lg font-bold mb-4">
            Monthly Overview
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
            chartConfig={chartConfig}
            style={{
              borderRadius: 16,
            }}
            yAxisLabel="$"
            yAxisSuffix=""
            fromZero
            showValuesOnTopOfBars
          />
        </Card>

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
            }}
            bezier
            style={{
              borderRadius: 16,
            }}
            yAxisLabel="$"
          />
        </Card>

        <Card className="mb-6 p-4">
          <Text className="text-gray-900 dark:text-white text-lg font-bold mb-4">
            Expense Distribution
          </Text>
          {pieData.length > 0 ? (
            <View className="items-center">
              <View className="relative items-center justify-center">
                <PieChart
                  data={pieData}
                  width={screenWidth - 48}
                  height={220}
                  chartConfig={chartConfig}
                  accessor="amount"
                  backgroundColor="transparent"
                  paddingLeft="0"
                  center={[screenWidth / 4, 0]}
                  absolute
                  hasLegend={false}
                />
                {/* Donut Hole */}
                <View 
                  className="absolute w-32 h-32 bg-white dark:bg-slate-800 rounded-full items-center justify-center"
                  style={{ pointerEvents: 'none' }}
                >
                  <Text className="text-gray-500 dark:text-gray-400 text-xs">Total</Text>
                  <Text className="text-gray-900 dark:text-white font-bold text-lg">
                    ${expenseData.reduce((sum, item) => sum + item.amount, 0).toFixed(0)}
                  </Text>
                </View>
              </View>
              
              {/* Custom Legend */}
              <View className="flex-row flex-wrap justify-center gap-3 mt-4">
                {pieData.map((item, index) => (
                  <View key={index} className="flex-row items-center gap-2">
                    <View 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }} 
                    />
                    <Text className="text-gray-600 dark:text-gray-300 text-xs">
                      {item.name} ({Math.round((item.amount / expenseData.reduce((sum, i) => sum + i.amount, 0)) * 100)}%)
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <Text className="text-gray-500 text-center py-8">No expense data available</Text>
          )}
        </Card>

        <View className="flex-row flex-wrap gap-4 mb-6">
          <Card className="flex-1 min-w-[45%] p-4">
            <Text className="text-gray-600 dark:text-gray-400 text-xs mb-1">
              Avg. Daily Expense
            </Text>
            <Text className="text-gray-900 dark:text-white text-2xl font-bold">
              $42.50
            </Text>
          </Card>
          <Card className="flex-1 min-w-[45%] p-4">
            <Text className="text-gray-600 dark:text-gray-400 text-xs mb-1">
              Total Transactions
            </Text>
            <Text className="text-gray-900 dark:text-white text-2xl font-bold">
              {transactions.length}
            </Text>
          </Card>
          <Card className="flex-1 min-w-[45%] p-4">
            <Text className="text-gray-600 dark:text-gray-400 text-xs mb-1">
              Largest Expense
            </Text>
            <Text className="text-red-500 text-2xl font-bold">
              $250.00
            </Text>
          </Card>
          <Card className="flex-1 min-w-[45%] p-4">
            <Text className="text-gray-600 dark:text-gray-400 text-xs mb-1">
              Largest Revenue
            </Text>
            <Text className="text-green-500 text-2xl font-bold">
              $5,000.00
            </Text>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
};

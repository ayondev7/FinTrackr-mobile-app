import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, StatsCard } from '../components';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { useTransactionStore, useThemeStore, useUserStore } from '../store';
import { colors } from '../constants/theme';
import { TrendingUp, TrendingDown, DollarSign, Activity, CreditCard } from 'lucide-react-native';

export const AnalyticsScreen = () => {
  const insets = useSafeAreaInsets();
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
    <ScrollView 
      className="flex-1 bg-gray-50 dark:bg-slate-900"
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <View className="p-6" style={{ paddingTop: insets.top + 24 }}>
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
            chartConfig={{
              ...chartConfig,
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

        <Card className="mb-6 p-4">
          <Text className="text-gray-900 dark:text-white text-lg font-bold mb-4">
            Expense Distribution
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
                  paddingLeft="55"
                  hasLegend={false}
                  center={[0, 0]}
                />
                {/* Donut Hole */}
                <View 
                  className="absolute w-32 h-32 bg-white dark:bg-slate-800 rounded-full items-center justify-center"
                  style={{ pointerEvents: 'none', top: 46, left: 46 }}
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

        <View className="flex-row flex-wrap justify-between gap-y-4 mb-6">
          <View className="w-[48%]">
            <StatsCard
              title="Avg. Daily"
              value="$42.50"
              icon={<Activity size={20} color={themeColors.primary} />}
              color={themeColors.primary}
              trend={{ value: "+12%", isPositive: true }}
            />
          </View>
          <View className="w-[48%]">
            <StatsCard
              title="Total Txns"
              value={transactions.length.toString()}
              icon={<CreditCard size={20} color="#8B5CF6" />}
              color="#8B5CF6"
            />
          </View>
          <View className="w-[48%]">
            <StatsCard
              title="Max Expense"
              value="$250.00"
              icon={<TrendingDown size={20} color="#EF4444" />}
              color="#EF4444"
            />
          </View>
          <View className="w-[48%]">
            <StatsCard
              title="Max Revenue"
              value="$5,000.00"
              icon={<TrendingUp size={20} color="#10B981" />}
              color="#10B981"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

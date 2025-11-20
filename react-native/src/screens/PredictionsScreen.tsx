import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { Card } from '../components';
import { useTransactionStore, useUserStore, useThemeStore } from '../store';
import { formatCurrency } from '../utils/helpers';
import { colors } from '../constants/theme';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react-native';

export const PredictionsScreen = () => {
  const insets = useSafeAreaInsets();
  const { transactions } = useTransactionStore();
  const { user } = useUserStore();
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  const screenWidth = Dimensions.get('window').width;
  const isDark = theme === 'dark';

  const calculateAverages = () => {
    const expenses = transactions.filter((txn) => txn.type === 'expense');
    const totalExpense = expenses.reduce((sum, txn) => sum + txn.amount, 0);
    const avgMonthlyExpense = totalExpense / 6;

    const revenues = transactions.filter((txn) => txn.type === 'revenue');
    const totalRevenue = revenues.reduce((sum, txn) => sum + txn.amount, 0);
    const avgMonthlyRevenue = totalRevenue / 6;

    return { avgMonthlyExpense, avgMonthlyRevenue };
  };

  const { avgMonthlyExpense, avgMonthlyRevenue } = calculateAverages();
  const netMonthly = avgMonthlyRevenue - avgMonthlyExpense;
  const monthsLeft = user.currentBalance / avgMonthlyExpense;
  const isPositive = netMonthly >= 0;

  const projections = [
    { month: 'Dec', shortMonth: 'Dec', balance: user.currentBalance + netMonthly },
    { month: 'Jan', shortMonth: 'Jan', balance: user.currentBalance + netMonthly * 2 },
    { month: 'Feb', shortMonth: 'Feb', balance: user.currentBalance + netMonthly * 3 },
    { month: 'Mar', shortMonth: 'Mar', balance: user.currentBalance + netMonthly * 4 },
    { month: 'Apr', shortMonth: 'Apr', balance: user.currentBalance + netMonthly * 5 },
    { month: 'May', shortMonth: 'May', balance: user.currentBalance + netMonthly * 6 },
  ];

  const getStatus = (balance: number) => {
    if (balance >= user.currentBalance * 1.1) return 'healthy';
    if (balance >= user.currentBalance * 0.8) return 'warning';
    return 'critical';
  };

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

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-slate-900">
      <View className="p-6" style={{ paddingTop: insets.top + 24 }}>
        <Text className="text-gray-900 dark:text-white text-3xl font-bold mb-2">
          Financial Forecast
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 text-base mb-6">
          Your 6-month sustainability prediction
        </Text>

        <Card className="mb-6 p-6" variant="elevated" style={{ backgroundColor: isPositive ? '#10B98110' : '#EF444410' }}>
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-1">
              <Text className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                Balance Trend
              </Text>
              <View className="flex-row items-center gap-2">
                {isPositive ? (
                  <TrendingUp size={32} color="#10B981" />
                ) : (
                  <TrendingDown size={32} color="#EF4444" />
                )}
                <Text className={`text-3xl font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {isPositive ? 'Growing' : 'Declining'}
                </Text>
              </View>
            </View>
            <View
              className="w-16 h-16 rounded-full items-center justify-center"
              style={{ backgroundColor: isPositive ? '#10B98120' : '#EF444420' }}
            >
              {isPositive ? (
                <CheckCircle size={32} color="#10B981" />
              ) : (
                <AlertCircle size={32} color="#EF4444" />
              )}
            </View>
          </View>
          <Text className="text-gray-600 dark:text-gray-400 text-sm">
            {isPositive 
              ? `Your balance will grow by ${formatCurrency(netMonthly * 6, user.currency)} in 6 months`
              : `Your balance will decrease by ${formatCurrency(Math.abs(netMonthly * 6), user.currency)} in 6 months`
            }
          </Text>
        </Card>

        <Card className="mb-6 p-4">
          <Text className="text-gray-900 dark:text-white text-lg font-bold mb-4">
            6-Month Balance Projection
          </Text>
          <LineChart
            data={{
              labels: ['Now', ...projections.map(p => p.shortMonth)],
              datasets: [{
                data: [user.currentBalance, ...projections.map(p => p.balance)],
              }],
            }}
            width={screenWidth - 80}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{
              borderRadius: 16,
            }}
            yAxisLabel="$"
            withInnerLines={false}
            withOuterLines={false}
            withVerticalLines={false}
            withHorizontalLines={true}
            withDots={true}
            withShadow={false}
          />
        </Card>

        <View className="flex-row gap-3 mb-6">
          <Card className="flex-1 p-4">
            <View
              className="w-10 h-10 rounded-xl items-center justify-center mb-2"
              style={{ backgroundColor: '#EF444420' }}
            >
              <TrendingDown size={20} color="#EF4444" />
            </View>
            <Text className="text-gray-600 dark:text-gray-400 text-xs mb-1">
              Monthly Expense
            </Text>
            <Text className="text-red-500 text-lg font-bold">
              {formatCurrency(avgMonthlyExpense, user.currency)}
            </Text>
          </Card>

          <Card className="flex-1 p-4">
            <View
              className="w-10 h-10 rounded-xl items-center justify-center mb-2"
              style={{ backgroundColor: '#10B98120' }}
            >
              <TrendingUp size={20} color="#10B981" />
            </View>
            <Text className="text-gray-600 dark:text-gray-400 text-xs mb-1">
              Monthly Revenue
            </Text>
            <Text className="text-green-500 text-lg font-bold">
              {formatCurrency(avgMonthlyRevenue, user.currency)}
            </Text>
          </Card>

          <Card className="flex-1 p-4">
            <View
              className="w-10 h-10 rounded-xl items-center justify-center mb-2"
              style={{ backgroundColor: isPositive ? '#10B98120' : '#EF444420' }}
            >
              {isPositive ? (
                <TrendingUp size={20} color="#10B981" />
              ) : (
                <TrendingDown size={20} color="#EF4444" />
              )}
            </View>
            <Text className="text-gray-600 dark:text-gray-400 text-xs mb-1">
              Net Change
            </Text>
            <Text
              className="text-lg font-bold"
              style={{ color: isPositive ? '#10B981' : '#EF4444' }}
            >
              {isPositive ? '+' : ''}
              {formatCurrency(netMonthly, user.currency)}
            </Text>
          </Card>
        </View>

        <Card className="mb-6 p-6" variant="elevated">
          <Text className="text-gray-900 dark:text-white text-lg font-bold mb-4">
            Monthly Breakdown
          </Text>
          <View className="gap-3">
            {projections.map((projection, index) => {
              const status = getStatus(projection.balance);
              const change = index === 0 
                ? netMonthly 
                : projection.balance - projections[index - 1].balance;
              
              return (
                <View key={index} className="flex-row items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
                  <View className="flex-row items-center gap-3 flex-1">
                    <View
                      className={`w-2 h-10 rounded-full ${
                        status === 'healthy' ? 'bg-green-500' :
                        status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                    />
                    <View className="flex-1">
                      <Text className="text-gray-900 dark:text-white font-semibold">
                        {projection.month}
                      </Text>
                      <Text className="text-gray-500 dark:text-gray-400 text-xs">
                        {change >= 0 ? '+' : ''}{formatCurrency(change, user.currency)}
                      </Text>
                    </View>
                  </View>
                  <Text
                    className="text-lg font-bold"
                    style={{ color: projection.balance >= user.currentBalance ? '#10B981' : '#EF4444' }}
                  >
                    {formatCurrency(projection.balance, user.currency)}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>

        <Card className="p-6 mb-6" variant="elevated">
          <Text className="text-gray-900 dark:text-white text-lg font-bold mb-4">
            💡 Smart Insights
          </Text>
          <View className="gap-3">
            {isPositive ? (
              <>
                <View className="flex-row gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <CheckCircle size={20} color="#10B981" />
                  <Text className="text-gray-700 dark:text-gray-300 flex-1">
                    Your finances are on a positive trajectory! Keep it up!
                  </Text>
                </View>
                <View className="flex-row gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <AlertCircle size={20} color="#3B82F6" />
                  <Text className="text-gray-700 dark:text-gray-300 flex-1">
                    Consider saving {formatCurrency(netMonthly * 0.2, user.currency)}/month for emergencies
                  </Text>
                </View>
                <View className="flex-row gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <TrendingUp size={20} color="#A855F7" />
                  <Text className="text-gray-700 dark:text-gray-300 flex-1">
                    At this rate, you'll have {formatCurrency(projections[5].balance, user.currency)} in 6 months
                  </Text>
                </View>
              </>
            ) : (
              <>
                <View className="flex-row gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                  <AlertCircle size={20} color="#EF4444" />
                  <Text className="text-gray-700 dark:text-gray-300 flex-1">
                    Warning: Your expenses exceed your revenue
                  </Text>
                </View>
                <View className="flex-row gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                  <AlertCircle size={20} color="#F59E0B" />
                  <Text className="text-gray-700 dark:text-gray-300 flex-1">
                    Consider reducing monthly expenses by {formatCurrency(Math.abs(netMonthly), user.currency)}
                  </Text>
                </View>
                <View className="flex-row gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <TrendingUp size={20} color="#3B82F6" />
                  <Text className="text-gray-700 dark:text-gray-300 flex-1">
                    Look for ways to increase your income streams
                  </Text>
                </View>
              </>
            )}
          </View>
        </Card>
      </View>
    </ScrollView>
  );
};

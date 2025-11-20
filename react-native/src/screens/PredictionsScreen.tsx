import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '../components';
import { useTransactionStore, useUserStore } from '../store';
import { formatCurrency } from '../utils/helpers';

export const PredictionsScreen = () => {
  const insets = useSafeAreaInsets();
  const { transactions } = useTransactionStore();
  const { user } = useUserStore();

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

  const projections = [
    { month: 'Dec 2025', balance: user.currentBalance + netMonthly, status: 'healthy' },
    { month: 'Jan 2026', balance: user.currentBalance + netMonthly * 2, status: 'healthy' },
    { month: 'Feb 2026', balance: user.currentBalance + netMonthly * 3, status: 'healthy' },
    { month: 'Mar 2026', balance: user.currentBalance + netMonthly * 4, status: 'healthy' },
    { month: 'Apr 2026', balance: user.currentBalance + netMonthly * 5, status: 'healthy' },
    { month: 'May 2026', balance: user.currentBalance + netMonthly * 6, status: 'healthy' },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-slate-900">
      <View className="p-6" style={{ paddingTop: insets.top + 24 }}>
        <Text className="text-gray-900 dark:text-white text-3xl font-bold mb-2">
          Predictions 📊
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 text-base mb-6">
          Financial sustainability forecast
        </Text>

        <Card className="mb-6 p-6" variant="elevated">
          <Text className="text-gray-600 dark:text-gray-400 text-sm mb-2">
            Balance Sustainability
          </Text>
          <Text className="text-purple-500 text-4xl font-bold mb-2">
            {monthsLeft.toFixed(1)} months
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-sm">
            At current spending rate
          </Text>
        </Card>

        <View className="flex-row gap-4 mb-6">
          <Card className="flex-1 p-4">
            <Text className="text-gray-600 dark:text-gray-400 text-xs mb-1">
              Avg. Monthly Expense
            </Text>
            <Text className="text-red-500 text-xl font-bold">
              {formatCurrency(avgMonthlyExpense, user.currency)}
            </Text>
          </Card>

          <Card className="flex-1 p-4">
            <Text className="text-gray-600 dark:text-gray-400 text-xs mb-1">
              Avg. Monthly Revenue
            </Text>
            <Text className="text-green-500 text-xl font-bold">
              {formatCurrency(avgMonthlyRevenue, user.currency)}
            </Text>
          </Card>
        </View>

        <Card className="mb-6 p-4">
          <Text className="text-gray-600 dark:text-gray-400 text-xs mb-1">
            Net Monthly Change
          </Text>
          <Text
            className="text-2xl font-bold"
            style={{ color: netMonthly >= 0 ? '#10B981' : '#EF4444' }}
          >
            {netMonthly >= 0 ? '+' : ''}
            {formatCurrency(netMonthly, user.currency)}
          </Text>
        </Card>

        <Text className="text-gray-900 dark:text-white text-xl font-bold mb-4">
          6-Month Projection
        </Text>
        <View className="mb-6">
          {projections.map((projection, index) => (
            <Card key={index} className="mb-3 p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-gray-900 dark:text-white font-semibold mb-1">
                    {projection.month}
                  </Text>
                  <View
                    className={`px-2 py-1 rounded-full self-start ${
                      projection.status === 'healthy'
                        ? 'bg-green-100 dark:bg-green-900/30'
                        : projection.status === 'warning'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30'
                        : 'bg-red-100 dark:bg-red-900/30'
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        projection.status === 'healthy'
                          ? 'text-green-600 dark:text-green-400'
                          : projection.status === 'warning'
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {projection.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text
                  className="text-xl font-bold"
                  style={{ color: projection.balance >= user.currentBalance ? '#10B981' : '#EF4444' }}
                >
                  {formatCurrency(projection.balance, user.currency)}
                </Text>
              </View>
            </Card>
          ))}
        </View>

        <Card className="p-6" variant="elevated">
          <Text className="text-gray-900 dark:text-white text-lg font-bold mb-4">
            💡 Recommendations
          </Text>
          <View className="gap-3">
            <View className="flex-row gap-2">
              <Text className="text-green-500">✓</Text>
              <Text className="text-gray-700 dark:text-gray-300 flex-1">
                Your current balance is healthy and sustainable
              </Text>
            </View>
            <View className="flex-row gap-2">
              <Text className="text-green-500">✓</Text>
              <Text className="text-gray-700 dark:text-gray-300 flex-1">
                Revenue exceeds expenses - great job!
              </Text>
            </View>
            <View className="flex-row gap-2">
              <Text className="text-blue-500">ℹ</Text>
              <Text className="text-gray-700 dark:text-gray-300 flex-1">
                Consider increasing savings by 10% for emergency fund
              </Text>
            </View>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
};

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Card, TransactionItem } from '../components';
import { useUserStore, useTransactionStore, useThemeStore } from '../store';
import { colors } from '../constants/theme';
import { formatCurrency } from '../utils/helpers';
import { ArrowDownCircle, ArrowUpCircle, ChevronRight, TrendingUp, Activity, HeartPulse } from 'lucide-react-native';

export const DashboardScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user } = useUserStore();
  const { transactions } = useTransactionStore();
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  const isDark = theme === 'dark';

  const recentTransactions = transactions.slice(0, 5);

  const calculateTotals = () => {
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();

    const monthlyTransactions = transactions.filter((txn) => {
      const txnDate = new Date(txn.date);
      return txnDate.getMonth() === thisMonth && txnDate.getFullYear() === thisYear;
    });

    const totalExpense = monthlyTransactions
      .filter((txn) => txn.type === 'expense')
      .reduce((sum, txn) => sum + txn.amount, 0);

    const totalRevenue = monthlyTransactions
      .filter((txn) => txn.type === 'revenue')
      .reduce((sum, txn) => sum + txn.amount, 0);

    return { totalExpense, totalRevenue };
  };

  const { totalExpense, totalRevenue } = calculateTotals();

  return (
    <ScrollView 
      className="flex-1 bg-gray-50 dark:bg-slate-900"
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <View className="px-4" style={{ paddingTop: insets.top + 16 }}>
        <View 
          className="mb-6 p-6 rounded-3xl overflow-hidden"
          style={{
            backgroundColor: isDark ? '#6366F1' : '#6366F1',
            shadowColor: '#6366F1',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <View 
            className="absolute rounded-full"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              width: 160,
              height: 160,
              right: -40,
              top: -40,
            }}
          />
          <View 
            className="absolute rounded-full"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              width: 120,
              height: 120,
              left: -20,
              bottom: -20,
            }}
          />
          
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-indigo-100 text-sm font-medium tracking-wide">
              TOTAL BALANCE
            </Text>
            <View 
              className="px-3 py-1.5 rounded-full"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            >
              <Text className="text-white text-xs font-bold">
                {user.currency}
              </Text>
            </View>
          </View>
          
          <Text className="text-white text-5xl font-bold mb-4 tracking-tight">
            {formatCurrency(user.currentBalance, user.currency)}
          </Text>
          
          <View className="flex-row items-center gap-2">
            <View 
              className="flex-row items-center px-3 py-1.5 rounded-full"
              style={{ backgroundColor: 'rgba(16, 185, 129, 0.25)' }}
            >
              <TrendingUp size={14} color="#10B981" />
              <Text className="text-green-300 text-xs font-bold ml-1">
                +12.5%
              </Text>
            </View>
            <Text className="text-indigo-100 text-xs font-medium">
              vs last month
            </Text>
          </View>
        </View>

        <View className="flex-row gap-3 mb-6">
          <Card className="flex-1 bg-gradient-to-br">
            <View
              className="w-12 h-12 rounded-xl items-center justify-center mb-3"
              style={{ backgroundColor: `${themeColors.success}20` }}
            >
              <ArrowDownCircle size={24} color={themeColors.success} />
            </View>
            <Text className="text-gray-600 dark:text-gray-400 text-sm mb-1">
              Revenue
            </Text>
            <Text
              className="text-xl font-bold"
              style={{ color: themeColors.success }}
            >
              {formatCurrency(totalRevenue, user.currency)}
            </Text>
            <Text className="text-gray-500 dark:text-gray-500 text-xs mt-1">
              This month
            </Text>
          </Card>

          <Card className="flex-1">
            <View
              className="w-12 h-12 rounded-xl items-center justify-center mb-3"
              style={{ backgroundColor: `${themeColors.danger}20` }}
            >
              <ArrowUpCircle size={24} color={themeColors.danger} />
            </View>
            <Text className="text-gray-600 dark:text-gray-400 text-sm mb-1">
              Expenses
            </Text>
            <Text
              className="text-xl font-bold"
              style={{ color: themeColors.danger }}
            >
              {formatCurrency(totalExpense, user.currency)}
            </Text>
            <Text className="text-gray-500 dark:text-gray-500 text-xs mt-1">
              This month
            </Text>
          </Card>
        </View>

        <Card className="mb-6">
          <View
            className="rounded-xl p-4 mb-4"
            style={{ backgroundColor: `${themeColors.primary}10` }}
          >
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-gray-700 dark:text-gray-300 font-medium">
                Net Cash Flow
              </Text>
              <Text
                className="text-xl font-bold"
                style={{
                  color:
                    totalRevenue - totalExpense >= 0
                      ? themeColors.success
                      : themeColors.danger,
                }}
              >
                {formatCurrency(totalRevenue - totalExpense, user.currency)}
              </Text>
            </View>
            <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${Math.min((totalExpense / totalRevenue) * 100, 100)}%`,
                  backgroundColor: themeColors.primary,
                }}
              />
            </View>
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-gray-500 dark:text-gray-500 text-xs mb-1">
                Expense Ratio
              </Text>
              <Text className="text-gray-900 dark:text-white font-semibold">
                {totalRevenue > 0
                  ? `${((totalExpense / totalRevenue) * 100).toFixed(1)}%`
                  : '0%'}
              </Text>
            </View>
            <View className="flex-1 items-end">
              <Text className="text-gray-500 dark:text-gray-500 text-xs mb-1">
                Savings
              </Text>
              <Text className="text-gray-900 dark:text-white font-semibold">
                {formatCurrency(totalRevenue - totalExpense, user.currency)}
              </Text>
            </View>
          </View>
        </Card>

        <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </Text>
        <View className="flex-row gap-3 mb-6">
          <TouchableOpacity
            className="flex-1"
            onPress={() => navigation.navigate('Predictions' as never)}
            activeOpacity={0.7}
          >
            <Card className="p-4">
              <View
                className="w-10 h-10 rounded-xl items-center justify-center mb-2"
                style={{ backgroundColor: `${themeColors.warning}20` }}
              >
                <TrendingUp size={20} color={themeColors.warning} />
              </View>
              <Text className="text-gray-900 dark:text-white font-semibold text-sm mb-1">
                Predictions
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-xs">
                Forecast
              </Text>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1"
            onPress={() => navigation.navigate('Healthcare' as never)}
            activeOpacity={0.7}
          >
            <Card className="p-4">
              <View
                className="w-10 h-10 rounded-xl items-center justify-center mb-2"
                style={{ backgroundColor: `${themeColors.danger}20` }}
              >
                <HeartPulse size={20} color={themeColors.danger} />
              </View>
              <Text className="text-gray-900 dark:text-white font-semibold text-sm mb-1">
                Healthcare
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-xs">
                Medical
              </Text>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1"
            onPress={() => navigation.navigate('Categories' as never)}
            activeOpacity={0.7}
          >
            <Card className="p-4">
              <View
                className="w-10 h-10 rounded-xl items-center justify-center mb-2"
                style={{ backgroundColor: `${themeColors.info}20` }}
              >
                <Activity size={20} color={themeColors.info} />
              </View>
              <Text className="text-gray-900 dark:text-white font-semibold text-sm mb-1">
                Categories
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-xs">
                Manage
              </Text>
            </Card>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold text-gray-900 dark:text-white">
            Recent Transactions
          </Text>
          <TouchableOpacity className="flex-row items-center">
            <Text
              className="text-sm font-medium mr-1"
              style={{ color: themeColors.primary }}
            >
              See All
            </Text>
            <ChevronRight size={16} color={themeColors.primary} />
          </TouchableOpacity>
        </View>

        {recentTransactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </View>
    </ScrollView>
  );
};

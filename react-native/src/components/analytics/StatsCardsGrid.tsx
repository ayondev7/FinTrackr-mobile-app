import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, TrendingDown, Activity, CreditCard } from 'lucide-react-native';
import { formatAmount, getCurrencySymbol } from '../../utils/helpers';
import { AnalyticsStats } from '../../types';

interface StatsCardsGridProps {
  stats: AnalyticsStats;
  isDark: boolean;
  currency?: string;
}

export const StatsCardsGrid: React.FC<StatsCardsGridProps> = ({ stats, isDark, currency = 'USD' }) => {
  const averageDaily = (stats.totalExpense + stats.totalRevenue) / 30;
  const currencySymbol = getCurrencySymbol(currency);

  return (
    <View className="flex-row flex-wrap justify-between gap-y-4 mb-6">
      <View className="w-[48%]">
        <View 
          className="rounded-3xl p-5 shadow-2xl"
          style={{
            backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
            borderWidth: 2,
            borderColor: isDark ? '#3B82F6' : '#BFDBFE',
          }}
        >
          <View className="flex-row items-center justify-between mb-3">
            <View 
              className="p-3 rounded-2xl shadow-md"
              style={{ backgroundColor: isDark ? '#3B82F6' : '#60A5FA' }}
            >
              <Activity size={24} color="#FFFFFF" />
            </View>
          </View>
          <Text className="text-blue-600 dark:text-blue-300 text-xs font-bold uppercase tracking-wide mb-1">
            Avg. Daily Spend
          </Text>
          <Text className="text-blue-900 dark:text-blue-100 text-2xl font-black">
            {currencySymbol}{formatAmount(stats.averageExpense)}
          </Text>
        </View>
      </View>

      <View className="w-[48%]">
        <View 
          className="rounded-3xl p-5 shadow-2xl"
          style={{
            backgroundColor: isDark ? '#1E1B3A' : '#F5F3FF',
            borderWidth: 2,
            borderColor: isDark ? '#8B5CF6' : '#DDD6FE',
          }}
        >
          <View className="flex-row items-center justify-between mb-3">
            <View 
              className="p-3 rounded-2xl shadow-md"
              style={{ backgroundColor: isDark ? '#8B5CF6' : '#A78BFA' }}
            >
              <CreditCard size={24} color="#FFFFFF" />
            </View>
            <View 
              className="w-8 h-8 rounded-full items-center justify-center"
              style={{ backgroundColor: isDark ? '#8B5CF6' : '#A78BFA' }}
            >
              <Text className="text-white text-lg font-bold">{stats.totalTransactions}</Text>
            </View>
          </View>
          <Text className="text-purple-600 dark:text-purple-300 text-xs font-bold uppercase tracking-wide mb-1">
            Transactions
          </Text>
          <Text className="text-purple-900 dark:text-purple-100 text-2xl font-black">
            {stats.totalTransactions}
          </Text>
        </View>
      </View>

      <View className="w-[48%]">
        <View 
          className="rounded-3xl p-5 shadow-2xl"
          style={{
            backgroundColor: isDark ? '#2D1B1E' : '#FEF2F2',
            borderWidth: 2,
            borderColor: isDark ? '#EF4444' : '#FECACA',
          }}
        >
          <View className="flex-row items-center justify-between mb-3">
            <View 
              className="p-3 rounded-2xl shadow-md"
              style={{ backgroundColor: isDark ? '#EF4444' : '#F87171' }}
            >
              <TrendingDown size={24} color="#FFFFFF" />
            </View>
            <View 
              className="px-2 py-1 rounded-lg"
              style={{ backgroundColor: isDark ? '#7F1D1D' : '#FEE2E2' }}
            >
              <Text className="text-red-600 dark:text-red-400 text-xs font-bold">{stats.expenseCount}</Text>
            </View>
          </View>
          <Text className="text-red-600 dark:text-red-300 text-xs font-bold uppercase tracking-wide mb-1">
            Total Expense
          </Text>
          <Text className="text-red-900 dark:text-red-100 text-2xl font-black">
            {currencySymbol}{formatAmount(stats.totalExpense)}
          </Text>
        </View>
      </View>

      <View className="w-[48%]">
        <View 
          className="rounded-3xl p-5 shadow-2xl"
          style={{
            backgroundColor: isDark ? '#1B2D23' : '#F0FDF4',
            borderWidth: 2,
            borderColor: isDark ? '#10B981' : '#BBF7D0',
          }}
        >
          <View className="flex-row items-center justify-between mb-3">
            <View 
              className="p-3 rounded-2xl shadow-md"
              style={{ backgroundColor: isDark ? '#10B981' : '#34D399' }}
            >
              <TrendingUp size={24} color="#FFFFFF" />
            </View>
            <View 
              className="px-2 py-1 rounded-lg"
              style={{ backgroundColor: isDark ? '#065F46' : '#D1FAE5' }}
            >
              <Text className="text-green-600 dark:text-green-400 text-xs font-bold">{stats.revenueCount}</Text>
            </View>
          </View>
          <Text className="text-green-600 dark:text-green-300 text-xs font-bold uppercase tracking-wide mb-1">
            Total Revenue
          </Text>
          <Text className="text-green-900 dark:text-green-100 text-2xl font-black">
            {currencySymbol}{formatAmount(stats.totalRevenue)}
          </Text>
        </View>
      </View>
    </View>
  );
};

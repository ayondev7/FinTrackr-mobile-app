import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '../shared/Card';
import { Wallet, TrendingDown, AlertCircle, CheckCircle2 } from 'lucide-react-native';
import { Budget } from '../../types';

interface BudgetSummaryCardProps {
  budgets: Budget[];
  currency: string;
  primaryColor: string;
}

export const BudgetSummaryCard = ({
  budgets,
  currency,
  primaryColor,
}: BudgetSummaryCardProps) => {
  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const overBudgetCount = budgets.filter((b) => b.spent > b.limit).length;
  const nearLimitCount = budgets.filter((b) => {
    const pct = (b.spent / b.limit) * 100;
    return pct >= b.alertThreshold && b.spent <= b.limit;
  }).length;
  const onTrackCount = budgets.length - overBudgetCount - nearLimitCount;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="mb-6 p-5">
      <View className="flex-row items-center gap-3 mb-4">
        <View
          className="w-12 h-12 rounded-xl items-center justify-center"
          style={{ backgroundColor: `${primaryColor}20` }}
        >
          <Wallet size={24} color={primaryColor} />
        </View>
        <View className="flex-1">
          <Text className="text-gray-500 dark:text-gray-400 text-sm">
            Total Monthly Budget
          </Text>
          <Text className="text-gray-900 dark:text-white text-2xl font-bold">
            {formatCurrency(totalBudget)}
          </Text>
        </View>
      </View>

      <View className="flex-row gap-3 mb-4">
        <View className="flex-1 bg-gray-50 dark:bg-slate-700 rounded-xl p-3">
          <View className="flex-row items-center gap-2 mb-1">
            <TrendingDown size={16} color="#EF4444" />
            <Text className="text-gray-500 dark:text-gray-400 text-xs">Spent</Text>
          </View>
          <Text className="text-gray-900 dark:text-white font-bold text-lg">
            {formatCurrency(totalSpent)}
          </Text>
        </View>
        <View className="flex-1 bg-gray-50 dark:bg-slate-700 rounded-xl p-3">
          <View className="flex-row items-center gap-2 mb-1">
            <Wallet size={16} color="#10B981" />
            <Text className="text-gray-500 dark:text-gray-400 text-xs">Remaining</Text>
          </View>
          <Text
            className="font-bold text-lg"
            style={{ color: totalRemaining >= 0 ? '#10B981' : '#EF4444' }}
          >
            {formatCurrency(totalRemaining)}
          </Text>
        </View>
      </View>

      {/* Overall Progress */}
      <View className="mb-4">
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-500 dark:text-gray-400 text-sm">Overall Progress</Text>
          <Text className="text-gray-900 dark:text-white font-semibold">
            {Math.round(overallPercentage)}%
          </Text>
        </View>
        <View className="w-full h-3 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden">
          <View
            className="h-full rounded-full"
            style={{
              width: `${Math.min(overallPercentage, 100)}%`,
              backgroundColor:
                overallPercentage > 100
                  ? '#EF4444'
                  : overallPercentage >= 80
                  ? '#F59E0B'
                  : primaryColor,
            }}
          />
        </View>
      </View>

      {/* Status Summary */}
      <View className="flex-row gap-2">
        <View className="flex-1 flex-row items-center justify-center gap-1 bg-green-50 dark:bg-green-900/20 rounded-xl py-2">
          <CheckCircle2 size={14} color="#10B981" />
          <Text className="text-green-600 dark:text-green-400 text-xs font-medium">
            {onTrackCount} On Track
          </Text>
        </View>
        <View className="flex-1 flex-row items-center justify-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl py-2">
          <AlertCircle size={14} color="#F59E0B" />
          <Text className="text-yellow-600 dark:text-yellow-400 text-xs font-medium">
            {nearLimitCount} Near Limit
          </Text>
        </View>
        <View className="flex-1 flex-row items-center justify-center gap-1 bg-red-50 dark:bg-red-900/20 rounded-xl py-2">
          <AlertCircle size={14} color="#EF4444" />
          <Text className="text-red-600 dark:text-red-400 text-xs font-medium">
            {overBudgetCount} Over
          </Text>
        </View>
      </View>
    </Card>
  );
};

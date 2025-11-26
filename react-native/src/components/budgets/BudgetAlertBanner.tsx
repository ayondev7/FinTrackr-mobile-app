import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AlertTriangle, ChevronRight } from 'lucide-react-native';
import { Budget } from '../../types';

interface BudgetAlertBannerProps {
  budgets: Budget[];
  onPress: () => void;
}

export const BudgetAlertBanner = ({ budgets, onPress }: BudgetAlertBannerProps) => {
  const overBudgetItems = budgets.filter((b) => b.spent > b.limit);
  const nearLimitItems = budgets.filter((b) => {
    const pct = (b.spent / b.limit) * 100;
    return pct >= b.alertThreshold && b.spent <= b.limit;
  });

  if (overBudgetItems.length === 0 && nearLimitItems.length === 0) {
    return null;
  }

  const isOverBudget = overBudgetItems.length > 0;
  const alertCount = overBudgetItems.length + nearLimitItems.length;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`flex-row items-center justify-between p-4 rounded-2xl mb-4 ${
        isOverBudget ? 'bg-red-50 dark:bg-red-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'
      }`}
    >
      <View className="flex-row items-center gap-3 flex-1">
        <View
          className={`w-10 h-10 rounded-full items-center justify-center ${
            isOverBudget ? 'bg-red-100 dark:bg-red-800/30' : 'bg-yellow-100 dark:bg-yellow-800/30'
          }`}
        >
          <AlertTriangle size={20} color={isOverBudget ? '#EF4444' : '#F59E0B'} />
        </View>
        <View className="flex-1">
          <Text
            className={`font-semibold ${
              isOverBudget ? 'text-red-700 dark:text-red-400' : 'text-yellow-700 dark:text-yellow-400'
            }`}
          >
            {isOverBudget ? 'Budget Alert!' : 'Approaching Limit'}
          </Text>
          <Text
            className={`text-sm ${
              isOverBudget ? 'text-red-600 dark:text-red-300' : 'text-yellow-600 dark:text-yellow-300'
            }`}
          >
            {alertCount} budget{alertCount > 1 ? 's' : ''} need{alertCount === 1 ? 's' : ''} attention
          </Text>
        </View>
      </View>
      <ChevronRight size={20} color={isOverBudget ? '#EF4444' : '#F59E0B'} />
    </TouchableOpacity>
  );
};

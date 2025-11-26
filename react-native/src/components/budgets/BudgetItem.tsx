import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card } from '../shared/Card';
import { BudgetProgressBar } from './BudgetProgressBar';
import { AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react-native';
import { Budget } from '../../types';

interface BudgetItemProps {
  budget: Budget;
  categoryColor: string;
  categoryIcon?: React.ReactNode;
  currency: string;
  onPress?: () => void;
}

export const BudgetItem = ({
  budget,
  categoryColor,
  categoryIcon,
  currency,
  onPress,
}: BudgetItemProps) => {
  const percentage = (budget.spent / budget.limit) * 100;
  const isOverBudget = budget.spent > budget.limit;
  const isNearLimit = percentage >= budget.alertThreshold && !isOverBudget;
  const remaining = budget.limit - budget.spent;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusIcon = () => {
    if (isOverBudget) {
      return <AlertTriangle size={16} color="#EF4444" />;
    }
    if (isNearLimit) {
      return <TrendingUp size={16} color="#F59E0B" />;
    }
    return <CheckCircle size={16} color="#10B981" />;
  };

  const getStatusText = () => {
    if (isOverBudget) {
      return `Over by ${formatCurrency(Math.abs(remaining))}`;
    }
    if (isNearLimit) {
      return `${formatCurrency(remaining)} left`;
    }
    return `${formatCurrency(remaining)} left`;
  };

  const getStatusColor = () => {
    if (isOverBudget) return '#EF4444';
    if (isNearLimit) return '#F59E0B';
    return '#10B981';
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card className="mb-3 p-4">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-3 flex-1">
            <View
              className="w-12 h-12 rounded-xl items-center justify-center"
              style={{ backgroundColor: `${categoryColor}20` }}
            >
              {categoryIcon}
            </View>
            <View className="flex-1">
              <Text className="text-gray-900 dark:text-white font-semibold text-base">
                {budget.categoryName}
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-sm capitalize">
                {budget.period}
              </Text>
            </View>
          </View>
          <View className="items-end">
            <Text className="text-gray-900 dark:text-white font-bold text-lg">
              {formatCurrency(budget.spent)}
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-sm">
              of {formatCurrency(budget.limit)}
            </Text>
          </View>
        </View>

        <BudgetProgressBar
          spent={budget.spent}
          limit={budget.limit}
          color={categoryColor}
        />

        <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-slate-700">
          <View className="flex-row items-center gap-2">
            {getStatusIcon()}
            <Text style={{ color: getStatusColor() }} className="font-medium text-sm">
              {getStatusText()}
            </Text>
          </View>
          <View
            className="px-2 py-1 rounded-full"
            style={{ backgroundColor: `${getStatusColor()}20` }}
          >
            <Text style={{ color: getStatusColor() }} className="text-xs font-semibold">
              {Math.round(percentage)}%
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

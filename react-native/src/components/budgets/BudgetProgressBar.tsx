import React from 'react';
import { View, Text } from 'react-native';

interface BudgetProgressBarProps {
  spent: number;
  limit: number;
  color: string;
  showLabels?: boolean;
  height?: number;
}

export const BudgetProgressBar = ({
  spent,
  limit,
  color,
  showLabels = true,
  height = 8,
}: BudgetProgressBarProps) => {
  const percentage = Math.min((spent / limit) * 100, 100);
  const isOverBudget = spent > limit;
  const isNearLimit = percentage >= 80 && !isOverBudget;

  const getBarColor = () => {
    if (isOverBudget) return '#EF4444';
    if (isNearLimit) return '#F59E0B';
    return color;
  };

  return (
    <View>
      <View
        className="w-full bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden"
        style={{ height }}
      >
        <View
          className="h-full rounded-full"
          style={{
            width: `${percentage}%`,
            backgroundColor: getBarColor(),
          }}
        />
      </View>
      {showLabels && (
        <View className="flex-row justify-between mt-1">
          <Text className="text-gray-500 dark:text-gray-400 text-xs">
            {Math.round(percentage)}% used
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-xs">
            {isOverBudget ? 'Over budget!' : `${(100 - percentage).toFixed(0)}% left`}
          </Text>
        </View>
      )}
    </View>
  );
};

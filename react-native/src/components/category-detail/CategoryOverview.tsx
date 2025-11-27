import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '../shared/Card';
import { CategoryIcon } from '../shared/CategoryIcon';
import { formatCurrency } from '../../utils/helpers';

interface CategoryOverviewProps {
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  categoryType: 'EXPENSE' | 'REVENUE';
  totalSpent: number;
  transactionCount: number;
  avgPerTransaction: number;
  currency: string;
}

export const CategoryOverview = ({ 
  categoryName,
  categoryIcon,
  categoryColor,
  categoryType,
  totalSpent, 
  transactionCount, 
  avgPerTransaction, 
  currency 
}: CategoryOverviewProps) => {
  const isExpense = categoryType === 'EXPENSE';
  const label = isExpense ? 'Total Spending' : 'Total Income';

  return (
    <Card className="mb-6 p-6" variant="elevated">
      <View className="flex-row items-center gap-3 mb-4">
        <View
          className="w-12 h-12 rounded-2xl items-center justify-center"
          style={{ backgroundColor: `${categoryColor}20` }}
        >
          <CategoryIcon iconName={categoryIcon} size={24} color={categoryColor} />
        </View>
        <Text className="text-gray-900 dark:text-white text-2xl font-bold flex-1">
          {categoryName}
        </Text>
      </View>
      <Text className="text-gray-600 dark:text-gray-400 text-sm mb-2">
        {label}
      </Text>
      <Text className="text-4xl font-bold mb-4" style={{ color: categoryColor }}>
        {formatCurrency(totalSpent, currency)}
      </Text>
      <View className="flex-row gap-4">
        <View className="flex-1">
          <Text className="text-gray-500 dark:text-gray-400 text-xs mb-1">
            Transactions
          </Text>
          <Text className="text-gray-900 dark:text-white font-semibold">
            {transactionCount}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-gray-500 dark:text-gray-400 text-xs mb-1">
            Avg. Amount
          </Text>
          <Text className="text-gray-900 dark:text-white font-semibold">
            {formatCurrency(avgPerTransaction, currency)}
          </Text>
        </View>
      </View>
    </Card>
  );
};

import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '../Card';
import { formatCurrency } from '../../utils/helpers';

interface CategoryOverviewProps {
  categoryName: string;
  categoryColor: string;
  totalSpent: number;
  transactionCount: number;
  avgPerTransaction: number;
  currency: string;
}

export const CategoryOverview = ({ 
  categoryName, 
  categoryColor, 
  totalSpent, 
  transactionCount, 
  avgPerTransaction, 
  currency 
}: CategoryOverviewProps) => {
  return (
    <Card className="mb-6 p-6" variant="elevated">
      <View className="flex-row items-center gap-3 mb-4">
        <View
          className="w-12 h-12 rounded-2xl"
          style={{ backgroundColor: categoryColor }}
        />
        <Text className="text-gray-900 dark:text-white text-2xl font-bold flex-1">
          {categoryName}
        </Text>
      </View>
      <Text className="text-gray-600 dark:text-gray-400 text-sm mb-2">
        Total Spending
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

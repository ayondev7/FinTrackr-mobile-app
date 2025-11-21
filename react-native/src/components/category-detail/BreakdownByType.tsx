import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '../shared/Card';
import { formatCurrency } from '../../utils/helpers';

interface SubCategory {
  description: string;
  amount: number;
  count: number;
}

interface BreakdownByTypeProps {
  subCategories: SubCategory[];
  totalSpent: number;
  categoryColor: string;
  currency: string;
}

export const BreakdownByType = ({ subCategories, totalSpent, categoryColor, currency }: BreakdownByTypeProps) => {
  if (subCategories.length === 0) {
    return null;
  }

  return (
    <>
      <Text className="text-gray-900 dark:text-white text-xl font-bold mb-4">
        Breakdown by Type
      </Text>
      <View className="mb-6">
        {subCategories.map((item, index) => (
          <Card key={index} className="mb-3 p-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-gray-900 dark:text-white font-semibold text-base">
                {item.description}
              </Text>
              <Text className="font-bold text-lg" style={{ color: categoryColor }}>
                {formatCurrency(item.amount, currency)}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-500 dark:text-gray-400 text-sm">
                {item.count} transaction{item.count > 1 ? 's' : ''}
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-sm">
                {((item.amount / totalSpent) * 100).toFixed(1)}% of total
              </Text>
            </View>
          </Card>
        ))}
      </View>
    </>
  );
};

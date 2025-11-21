import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '../Card';
import { formatCurrency } from '../../utils/helpers';
import { HeartPulse } from 'lucide-react-native';

interface HealthcareSummaryProps {
  totalSpent: number;
  transactionCount: number;
  avgPerVisit: number;
  currency: string;
}

export const HealthcareSummary = ({ totalSpent, transactionCount, avgPerVisit, currency }: HealthcareSummaryProps) => {
  return (
    <Card className="mb-6 p-6" variant="elevated">
      <Text className="text-gray-600 dark:text-gray-400 text-sm mb-2">
        Total Healthcare Spending
      </Text>
      <Text className="text-teal-500 text-4xl font-bold mb-4">
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
            Avg. Per Visit
          </Text>
          <Text className="text-gray-900 dark:text-white font-semibold">
            {formatCurrency(avgPerVisit, currency)}
          </Text>
        </View>
      </View>
    </Card>
  );
};

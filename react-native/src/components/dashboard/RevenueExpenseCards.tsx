import React from 'react';
import { View, Text } from 'react-native';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react-native';
import { Card } from '../shared/Card';
import { formatCurrency } from '../../utils/helpers';

interface RevenueExpenseCardsProps {
  totalRevenue: number;
  totalExpense: number;
  currency: string;
  successColor: string;
  dangerColor: string;
}

export const RevenueExpenseCards: React.FC<RevenueExpenseCardsProps> = ({
  totalRevenue,
  totalExpense,
  currency,
  successColor,
  dangerColor,
}) => {
  return (
    <View className="flex-row gap-3 mb-6">
      <Card className="flex-1 bg-gradient-to-br">
        <View
          className="w-12 h-12 rounded-xl items-center justify-center mb-3"
          style={{ backgroundColor: `${successColor}20` }}
        >
          <ArrowDownCircle size={24} color={successColor} />
        </View>
        <Text className="text-gray-600 dark:text-gray-400 text-sm mb-1">
          Revenue
        </Text>
        <Text
          className="text-xl font-bold"
          style={{ color: successColor }}
        >
          {formatCurrency(totalRevenue, currency)}
        </Text>
        <Text className="text-gray-500 dark:text-gray-500 text-xs mt-1">
          This month
        </Text>
      </Card>

      <Card className="flex-1">
        <View
          className="w-12 h-12 rounded-xl items-center justify-center mb-3"
          style={{ backgroundColor: `${dangerColor}20` }}
        >
          <ArrowUpCircle size={24} color={dangerColor} />
        </View>
        <Text className="text-gray-600 dark:text-gray-400 text-sm mb-1">
          Expenses
        </Text>
        <Text
          className="text-xl font-bold"
          style={{ color: dangerColor }}
        >
          {formatCurrency(totalExpense, currency)}
        </Text>
        <Text className="text-gray-500 dark:text-gray-500 text-xs mt-1">
          This month
        </Text>
      </Card>
    </View>
  );
};

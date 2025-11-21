import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '../shared/Card';
import { formatCurrency } from '../../utils/helpers';

interface CashFlowCardProps {
  totalRevenue: number;
  totalExpense: number;
  currency: string;
  primaryColor: string;
  successColor: string;
  dangerColor: string;
}

export const CashFlowCard: React.FC<CashFlowCardProps> = ({
  totalRevenue,
  totalExpense,
  currency,
  primaryColor,
  successColor,
  dangerColor,
}) => {
  const netCashFlow = totalRevenue - totalExpense;
  const expenseRatio = totalRevenue > 0 ? (totalExpense / totalRevenue) * 100 : 0;
  
  return (
    <Card className="mb-6">
      <View
        className="rounded-xl p-4 mb-4"
        style={{ backgroundColor: `${primaryColor}10` }}
      >
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-gray-700 dark:text-gray-300 font-medium">
            Net Cash Flow
          </Text>
          <Text
            className="text-xl font-bold"
            style={{
              color: netCashFlow >= 0 ? successColor : dangerColor,
            }}
          >
            {formatCurrency(netCashFlow, currency)}
          </Text>
        </View>
        <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <View
            className="h-full rounded-full"
            style={{
              width: `${Math.min(expenseRatio, 100)}%`,
              backgroundColor: primaryColor,
            }}
          />
        </View>
      </View>

      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-gray-500 dark:text-gray-500 text-xs mb-1">
            Expense Ratio
          </Text>
          <Text className="text-gray-900 dark:text-white font-semibold">
            {totalRevenue > 0 ? `${expenseRatio.toFixed(1)}%` : '0%'}
          </Text>
        </View>
        <View className="flex-1 items-end">
          <Text className="text-gray-500 dark:text-gray-500 text-xs mb-1">
            Savings
          </Text>
          <Text className="text-gray-900 dark:text-white font-semibold">
            {formatCurrency(netCashFlow, currency)}
          </Text>
        </View>
      </View>
    </Card>
  );
};

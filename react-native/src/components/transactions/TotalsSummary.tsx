import React from 'react';
import { View, Text } from 'react-native';
import { formatAmount, getCurrencySymbol, formatSmartCurrency } from '../../utils/helpers';

interface TotalsSummaryProps {
  totalExpense: number;
  totalRevenue: number;
  currency?: string;
}

export const TotalsSummary: React.FC<TotalsSummaryProps> = ({ totalExpense, totalRevenue, currency = 'USD' }) => {
  const currencySymbol = getCurrencySymbol(currency);
  
  return (
    <View className="flex-row justify-between">
      <View className="flex-1 mr-2">
        <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          Total Expenses
        </Text>
        <Text className="text-base font-bold text-red-500">
          {formatSmartCurrency(totalExpense, currency, 100000, 1)}
        </Text>
      </View>
      <View className="flex-1 ml-2">
        <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          Total Revenue
        </Text>
        <Text className="text-base font-bold text-green-500">
          {formatSmartCurrency(totalRevenue, currency, 100000, 1)}
        </Text>
      </View>
    </View>
  );
};

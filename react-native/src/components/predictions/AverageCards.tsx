import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import { Card } from '../shared/Card';
import { formatCurrency } from '../../utils/helpers';

interface AverageCardsProps {
  avgMonthlyExpense: number;
  avgMonthlyRevenue: number;
  netMonthly: number;
  isPositive: boolean;
  currency: string;
}

export const AverageCards = ({ avgMonthlyExpense, avgMonthlyRevenue, netMonthly, isPositive, currency }: AverageCardsProps) => {
  return (
    <View className="flex-row gap-3 mb-6">
      <Card className="flex-1 p-4">
        <View
          className="w-10 h-10 rounded-xl items-center justify-center mb-2"
          style={{ backgroundColor: '#EF444420' }}
        >
          <TrendingDown size={20} color="#EF4444" />
        </View>
        <Text className="text-gray-600 dark:text-gray-400 text-xs mb-1">
          Monthly Expense
        </Text>
        <Text className="text-red-500 text-lg font-bold">
          {formatCurrency(avgMonthlyExpense, currency)}
        </Text>
      </Card>

      <Card className="flex-1 p-4">
        <View
          className="w-10 h-10 rounded-xl items-center justify-center mb-2"
          style={{ backgroundColor: '#10B98120' }}
        >
          <TrendingUp size={20} color="#10B981" />
        </View>
        <Text className="text-gray-600 dark:text-gray-400 text-xs mb-1">
          Monthly Revenue
        </Text>
        <Text className="text-green-500 text-lg font-bold">
          {formatCurrency(avgMonthlyRevenue, currency)}
        </Text>
      </Card>

      <Card className="flex-1 p-4">
        <View
          className="w-10 h-10 rounded-xl items-center justify-center mb-2"
          style={{ backgroundColor: isPositive ? '#10B98120' : '#EF444420' }}
        >
          {isPositive ? (
            <TrendingUp size={20} color="#10B981" />
          ) : (
            <TrendingDown size={20} color="#EF4444" />
          )}
        </View>
        <Text className="text-gray-600 dark:text-gray-400 text-xs mb-1">
          Net Change
        </Text>
        <Text
          className="text-lg font-bold"
          style={{ color: isPositive ? '#10B981' : '#EF4444' }}
        >
          {isPositive ? '+' : ''}
          {formatCurrency(netMonthly, currency)}
        </Text>
      </Card>
    </View>
  );
};

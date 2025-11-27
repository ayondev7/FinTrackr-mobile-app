import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '../shared/Card';
import { formatCurrency } from '../../utils/helpers';
import { ProjectedBalance } from '../../types';

interface MonthlyBreakdownProps {
  projections: ProjectedBalance[];
  currentBalance: number;
  netMonthly: number;
  currency: string;
}

export const MonthlyBreakdown = ({ projections, currentBalance, netMonthly, currency }: MonthlyBreakdownProps) => {
  return (
    <Card className="mb-6 p-6" variant="elevated">
      <Text className="text-gray-900 dark:text-white text-lg font-bold mb-4">
        Monthly Breakdown
      </Text>
      <View className="gap-3">
        {projections.map((projection, index) => {
          const change = index === 0 
            ? netMonthly 
            : projection.estimatedBalance - projections[index - 1].estimatedBalance;
          
          return (
            <View key={index} className="flex-row items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
              <View className="flex-row items-center gap-3 flex-1">
                <View
                  className={`w-2 h-10 rounded-full ${
                    projection.status === 'healthy' ? 'bg-green-500' :
                    projection.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                />
                <View className="flex-1">
                  <Text className="text-gray-900 dark:text-white font-semibold">
                    {projection.month}
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-xs">
                    {change >= 0 ? '+' : ''}{formatCurrency(change, currency)}
                  </Text>
                </View>
              </View>
              <Text
                className="text-lg font-bold"
                style={{ color: projection.estimatedBalance >= currentBalance ? '#10B981' : '#EF4444' }}
              >
                {formatCurrency(projection.estimatedBalance, currency)}
              </Text>
            </View>
          );
        })}
      </View>
    </Card>
  );
};

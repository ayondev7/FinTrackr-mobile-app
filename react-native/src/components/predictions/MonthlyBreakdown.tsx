import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '../Card';
import { formatCurrency } from '../../utils/helpers';

interface Projection {
  month: string;
  shortMonth: string;
  balance: number;
}

interface MonthlyBreakdownProps {
  projections: Projection[];
  currentBalance: number;
  netMonthly: number;
  currency: string;
  getStatus: (balance: number) => 'healthy' | 'warning' | 'critical';
}

export const MonthlyBreakdown = ({ projections, currentBalance, netMonthly, currency, getStatus }: MonthlyBreakdownProps) => {
  return (
    <Card className="mb-6 p-6" variant="elevated">
      <Text className="text-gray-900 dark:text-white text-lg font-bold mb-4">
        Monthly Breakdown
      </Text>
      <View className="gap-3">
        {projections.map((projection, index) => {
          const status = getStatus(projection.balance);
          const change = index === 0 
            ? netMonthly 
            : projection.balance - projections[index - 1].balance;
          
          return (
            <View key={index} className="flex-row items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
              <View className="flex-row items-center gap-3 flex-1">
                <View
                  className={`w-2 h-10 rounded-full ${
                    status === 'healthy' ? 'bg-green-500' :
                    status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
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
                style={{ color: projection.balance >= currentBalance ? '#10B981' : '#EF4444' }}
              >
                {formatCurrency(projection.balance, currency)}
              </Text>
            </View>
          );
        })}
      </View>
    </Card>
  );
};

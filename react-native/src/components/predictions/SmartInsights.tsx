import React from 'react';
import { View, Text } from 'react-native';
import { CheckCircle, AlertCircle, TrendingUp } from 'lucide-react-native';
import { Card } from '../shared/Card';
import { formatCurrency } from '../../utils/helpers';

interface Projection {
  month: string;
  shortMonth: string;
  balance: number;
}

interface SmartInsightsProps {
  isPositive: boolean;
  netMonthly: number;
  projections: Projection[];
  currency: string;
}

export const SmartInsights = ({ isPositive, netMonthly, projections, currency }: SmartInsightsProps) => {
  return (
    <Card className="p-6 mb-6" variant="elevated">
      <Text className="text-gray-900 dark:text-white text-lg font-bold mb-4">
        💡 Smart Insights
      </Text>
      <View className="gap-3">
        {isPositive ? (
          <>
            <View className="flex-row gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <CheckCircle size={20} color="#10B981" />
              <Text className="text-gray-700 dark:text-gray-300 flex-1">
                Your finances are on a positive trajectory! Keep it up!
              </Text>
            </View>
            <View className="flex-row gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <AlertCircle size={20} color="#3B82F6" />
              <Text className="text-gray-700 dark:text-gray-300 flex-1">
                Consider saving {formatCurrency(netMonthly * 0.2, currency)}/month for emergencies
              </Text>
            </View>
            <View className="flex-row gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <TrendingUp size={20} color="#A855F7" />
              <Text className="text-gray-700 dark:text-gray-300 flex-1">
                At this rate, you'll have {formatCurrency(projections[5].balance, currency)} in 6 months
              </Text>
            </View>
          </>
        ) : (
          <>
            <View className="flex-row gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
              <AlertCircle size={20} color="#EF4444" />
              <Text className="text-gray-700 dark:text-gray-300 flex-1">
                Warning: Your expenses exceed your revenue
              </Text>
            </View>
            <View className="flex-row gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
              <AlertCircle size={20} color="#F59E0B" />
              <Text className="text-gray-700 dark:text-gray-300 flex-1">
                Consider reducing monthly expenses by {formatCurrency(Math.abs(netMonthly), currency)}
              </Text>
            </View>
            <View className="flex-row gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <TrendingUp size={20} color="#3B82F6" />
              <Text className="text-gray-700 dark:text-gray-300 flex-1">
                Look for ways to increase your income streams
              </Text>
            </View>
          </>
        )}
      </View>
    </Card>
  );
};

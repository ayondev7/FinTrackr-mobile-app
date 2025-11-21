import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react-native';
import { formatCurrency } from '../../utils/helpers';

interface BalanceTrendCardProps {
  isPositive: boolean;
  isDark: boolean;
  netMonthly: number;
  currency: string;
}

export const BalanceTrendCard = ({ isPositive, isDark, netMonthly, currency }: BalanceTrendCardProps) => {
  return (
    <View 
      className="mb-6 p-6 rounded-3xl border-2"
      style={{ 
        backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
        borderColor: isPositive 
          ? (isDark ? '#10B981' : '#BBF7D0') 
          : (isDark ? '#EF4444' : '#FECACA')
      }}
    >
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-1">
          <Text className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2">
            Balance Trend
          </Text>
          <View className="flex-row items-center gap-2">
            <View
              className="p-2 rounded-xl"
              style={{ backgroundColor: isPositive ? '#10B98120' : '#EF444420' }}
            >
              {isPositive ? (
                <TrendingUp size={28} color="#10B981" strokeWidth={2.5} />
              ) : (
                <TrendingDown size={28} color="#EF4444" strokeWidth={2.5} />
              )}
            </View>
            <Text className={`text-3xl font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? 'Growing' : 'Declining'}
            </Text>
          </View>
        </View>
        <View
          className="w-14 h-14 rounded-2xl items-center justify-center"
          style={{ backgroundColor: isPositive ? '#10B98115' : '#EF444415' }}
        >
          {isPositive ? (
            <CheckCircle size={28} color="#10B981" strokeWidth={2} />
          ) : (
            <AlertCircle size={28} color="#EF4444" strokeWidth={2} />
          )}
        </View>
      </View>
      <View 
        className="p-4 rounded-2xl"
        style={{ backgroundColor: isPositive ? '#10B98108' : '#EF444408' }}
      >
        <Text className="text-gray-700 dark:text-gray-300 text-sm leading-5">
          {isPositive 
            ? `Your balance will grow by ${formatCurrency(netMonthly * 6, currency)} in 6 months`
            : `Your balance will decrease by ${formatCurrency(Math.abs(netMonthly * 6), currency)} in 6 months`
          }
        </Text>
      </View>
    </View>
  );
};

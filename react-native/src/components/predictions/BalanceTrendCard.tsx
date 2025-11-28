import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, MinusCircle } from 'lucide-react-native';
import { formatCurrency } from '../../utils/helpers';

interface BalanceTrendCardProps {
  isPositive: boolean;
  isDark: boolean;
  netMonthly: number;
  currency: string;
}

export const BalanceTrendCard = ({ isPositive, isDark, netMonthly, currency }: BalanceTrendCardProps) => {
  const hasData = netMonthly !== 0;

  const getBorderColor = () => {
    if (!hasData) return isDark ? '#6B7280' : '#D1D5DB';
    return isPositive 
      ? (isDark ? '#10B981' : '#BBF7D0') 
      : (isDark ? '#EF4444' : '#FECACA');
  };

  const getTrendLabel = () => {
    if (!hasData) return 'No Data Available';
    return isPositive ? 'Growing' : 'Declining';
  };

  const getTrendColor = () => {
    if (!hasData) return 'text-gray-500';
    return isPositive ? 'text-green-500' : 'text-red-500';
  };

  const getIconBgColor = () => {
    if (!hasData) return '#6B728020';
    return isPositive ? '#10B98120' : '#EF444420';
  };

  const getStatusBgColor = () => {
    if (!hasData) return '#6B728015';
    return isPositive ? '#10B98115' : '#EF444415';
  };

  const getDescriptionBgColor = () => {
    if (!hasData) return '#6B728008';
    return isPositive ? '#10B98108' : '#EF444408';
  };

  const getDescription = () => {
    if (!hasData) {
      return 'Add some transactions to see your balance trend forecast.';
    }
    return isPositive 
      ? `Your balance will grow by ${formatCurrency(netMonthly * 6, currency)} in 6 months`
      : `Your balance will decrease by ${formatCurrency(Math.abs(netMonthly * 6), currency)} in 6 months`;
  };

  return (
    <View 
      className="mb-6 p-6 rounded-3xl border-2"
      style={{ 
        backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
        borderColor: getBorderColor()
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
              style={{ backgroundColor: getIconBgColor() }}
            >
              {!hasData ? (
                <MinusCircle size={28} color="#6B7280" strokeWidth={2.5} />
              ) : isPositive ? (
                <TrendingUp size={28} color="#10B981" strokeWidth={2.5} />
              ) : (
                <TrendingDown size={28} color="#EF4444" strokeWidth={2.5} />
              )}
            </View>
            <Text className={`text-3xl font-bold ${getTrendColor()}`}>
              {getTrendLabel()}
            </Text>
          </View>
        </View>
        <View
          className="w-14 h-14 rounded-2xl items-center justify-center"
          style={{ backgroundColor: getStatusBgColor() }}
        >
          {!hasData ? (
            <MinusCircle size={28} color="#6B7280" strokeWidth={2} />
          ) : isPositive ? (
            <CheckCircle size={28} color="#10B981" strokeWidth={2} />
          ) : (
            <AlertCircle size={28} color="#EF4444" strokeWidth={2} />
          )}
        </View>
      </View>
      <View 
        className="p-4 rounded-2xl"
        style={{ backgroundColor: getDescriptionBgColor() }}
      >
        <Text className="text-gray-700 dark:text-gray-300 text-sm leading-5">
          {getDescription()}
        </Text>
      </View>
    </View>
  );
};

import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp } from 'lucide-react-native';
import { formatCurrency } from '../../utils/helpers';

interface BalanceCardProps {
  balance: number;
  currency: string;
  isDark: boolean;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ balance, currency, isDark }) => {
  return (
    <View 
      className="mb-6 p-6 rounded-3xl overflow-hidden"
      style={{
        backgroundColor: isDark ? '#6366F1' : '#6366F1',
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
      }}
    >
      <View 
        className="absolute rounded-full"
        style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          width: 160,
          height: 160,
          right: -40,
          top: -40,
        }}
      />
      <View 
        className="absolute rounded-full"
        style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          width: 120,
          height: 120,
          left: -20,
          bottom: -20,
        }}
      />
      
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-indigo-100 text-sm font-medium tracking-wide">
          TOTAL BALANCE
        </Text>
        <View 
          className="px-3 py-1.5 rounded-full"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
        >
          <Text className="text-white text-xs font-bold">
            {currency}
          </Text>
        </View>
      </View>
      
      <Text className="text-white text-5xl font-bold mb-4 tracking-tight">
        {formatCurrency(balance, currency)}
      </Text>
      
      <View className="flex-row items-center gap-2">
        <View 
          className="flex-row items-center px-3 py-1.5 rounded-full"
          style={{ backgroundColor: 'rgba(16, 185, 129, 0.25)' }}
        >
          <TrendingUp size={14} color="#10B981" />
          <Text className="text-green-300 text-xs font-bold ml-1">
            +12.5%
          </Text>
        </View>
        <Text className="text-indigo-100 text-xs font-medium">
          vs last month
        </Text>
      </View>
    </View>
  );
};

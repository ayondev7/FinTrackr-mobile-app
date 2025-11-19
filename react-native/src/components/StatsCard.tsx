import React from 'react';
import { View, Text } from 'react-native';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = '#6366F1',
  trend,
}) => {
  return (
    <View
      className="rounded-2xl p-4 shadow-md"
      style={{ backgroundColor: `${color}10` }}
    >
      <View className="flex-row items-center justify-between mb-2">
        <View
          className="w-10 h-10 rounded-xl items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          {icon}
        </View>
        {trend && (
          <View
            className={`px-2 py-1 rounded-full ${
              trend.isPositive ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
            }`}
          >
            <Text className="text-xs font-medium" style={{ color: trend.isPositive ? '#10B981' : '#EF4444' }}>
              {trend.value}
            </Text>
          </View>
        )}
      </View>
      
      <Text className="text-gray-600 dark:text-gray-400 text-sm mb-1">
        {title}
      </Text>
      
      <Text className="text-2xl font-bold mb-1" style={{ color }}>
        {value}
      </Text>
      
      {subtitle && (
        <Text className="text-gray-500 dark:text-gray-400 text-xs">
          {subtitle}
        </Text>
      )}
    </View>
  );
};

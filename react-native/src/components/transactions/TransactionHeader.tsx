import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface TransactionHeaderProps {
  count: number;
  sortBy: 'date' | 'amount';
  onToggleSort: () => void;
  primaryColor: string;
}

export const TransactionHeader: React.FC<TransactionHeaderProps> = ({
  count,
  sortBy,
  onToggleSort,
  primaryColor,
}) => {
  return (
    <View className="flex-row items-center justify-between mb-4">
      <Text className="text-gray-600 dark:text-gray-400 text-sm">
        {count} transactions
      </Text>
      <TouchableOpacity onPress={onToggleSort}>
        <Text
          className="text-sm font-medium"
          style={{ color: primaryColor }}
        >
          Sort by: {sortBy === 'date' ? 'Date' : 'Amount'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

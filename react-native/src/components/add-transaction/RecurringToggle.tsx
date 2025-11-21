import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface RecurringToggleProps {
  isRecurring: boolean;
  onToggle: () => void;
}

export const RecurringToggle: React.FC<RecurringToggleProps> = ({ isRecurring, onToggle }) => {
  return (
    <TouchableOpacity onPress={onToggle} className="flex-row items-center justify-between">
      <View>
        <Text className="text-gray-900 dark:text-white font-medium mb-1">
          Recurring Transaction
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 text-sm">
          Automatically repeat this transaction
        </Text>
      </View>
      <View
        className={`w-12 h-7 rounded-full p-1 ${
          isRecurring ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <View className={`w-5 h-5 rounded-full bg-white ${isRecurring ? 'ml-auto' : ''}`} />
      </View>
    </TouchableOpacity>
  );
};

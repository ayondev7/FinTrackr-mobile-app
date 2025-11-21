import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface AnalyticsTypeFilterProps {
  analyticsType: 'expense' | 'revenue' | 'both';
  onSelect: (type: 'expense' | 'revenue' | 'both') => void;
}

export const AnalyticsTypeFilter: React.FC<AnalyticsTypeFilterProps> = ({ analyticsType, onSelect }) => {
  return (
    <View className="flex-row gap-2 mb-6">
      <TouchableOpacity
        onPress={() => onSelect('expense')}
        className={`flex-1 py-2.5 px-4 rounded-xl ${
          analyticsType === 'expense'
            ? 'bg-red-500'
            : 'bg-gray-100 dark:bg-slate-700'
        }`}
      >
        <Text
          className={`text-center font-semibold ${
            analyticsType === 'expense'
              ? 'text-white'
              : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          Expenses
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onSelect('revenue')}
        className={`flex-1 py-2.5 px-4 rounded-xl ${
          analyticsType === 'revenue'
            ? 'bg-green-500'
            : 'bg-gray-100 dark:bg-slate-700'
        }`}
      >
        <Text
          className={`text-center font-semibold ${
            analyticsType === 'revenue'
              ? 'text-white'
              : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          Revenue
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onSelect('both')}
        className={`flex-1 py-2.5 px-4 rounded-xl ${
          analyticsType === 'both'
            ? 'bg-indigo-600 dark:bg-indigo-500'
            : 'bg-gray-100 dark:bg-slate-700'
        }`}
      >
        <Text
          className={`text-center font-semibold ${
            analyticsType === 'both'
              ? 'text-white'
              : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          Both
        </Text>
      </TouchableOpacity>
    </View>
  );
};

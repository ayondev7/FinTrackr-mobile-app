import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AnalyticsType } from '../../types';

interface AnalyticsTypeFilterProps {
  analyticsType: AnalyticsType;
  onSelect: (type: AnalyticsType) => void;
}

export const AnalyticsTypeFilter: React.FC<AnalyticsTypeFilterProps> = ({ analyticsType, onSelect }) => {
  return (
    <View className="flex-row gap-2 mb-6">
      <TouchableOpacity
        onPress={() => onSelect('expense')}
        className={`flex-1 py-2.5 px-4 rounded-xl ${
          analyticsType === 'expense' ? '' : 'bg-gray-100 dark:bg-slate-700'
        }`}
        style={analyticsType === 'expense' ? {
          backgroundColor: '#FEF2F2',
          borderWidth: 2,
          borderColor: '#FECACA',
        } : undefined}
      >
        <Text
          className={`text-center font-semibold ${
            analyticsType === 'expense'
              ? 'text-red-700 dark:text-red-400'
              : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          Expenses
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onSelect('revenue')}
        className={`flex-1 py-2.5 px-4 rounded-xl ${
          analyticsType === 'revenue' ? '' : 'bg-gray-100 dark:bg-slate-700'
        }`}
        style={analyticsType === 'revenue' ? {
          backgroundColor: '#F0FDF4',
          borderWidth: 2,
          borderColor: '#BBF7D0',
        } : undefined}
      >
        <Text
          className={`text-center font-semibold ${
            analyticsType === 'revenue'
              ? 'text-green-700 dark:text-green-400'
              : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          Revenue
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onSelect('both')}
        className={`flex-1 py-2.5 px-4 rounded-xl ${
          analyticsType === 'both' ? '' : 'bg-gray-100 dark:bg-slate-700'
        }`}
        style={analyticsType === 'both' ? {
          backgroundColor: '#EFF6FF',
          borderWidth: 2,
          borderColor: '#BFDBFE',
        } : undefined}
      >
        <Text
          className={`text-center font-semibold ${
            analyticsType === 'both'
              ? 'text-blue-700 dark:text-blue-400'
              : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          Both
        </Text>
      </TouchableOpacity>
    </View>
  );
};

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FilterType } from '../../types';

interface TypeFilterProps {
  filterType: FilterType;
  onSelect: (type: FilterType) => void;
}

export const TypeFilter: React.FC<TypeFilterProps> = ({ filterType, onSelect }) => {
  return (
    <View className="flex-row gap-2 mb-4">
      <TouchableOpacity
        onPress={() => onSelect('all')}
        className={`flex-1 py-2 px-4 rounded-xl ${
          filterType === 'all' ? '' : 'bg-gray-100 dark:bg-slate-700'
        }`}
        style={filterType === 'all' ? {
          backgroundColor: '#EFF6FF',
          borderWidth: 2,
          borderColor: '#BFDBFE',
        } : undefined}
      >
        <Text
          className={`text-center font-medium ${
            filterType === 'all'
              ? 'text-blue-700 dark:text-blue-400'
              : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          All
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onSelect('expense')}
        className={`flex-1 py-2 px-4 rounded-xl ${
          filterType === 'expense' ? '' : 'bg-gray-100 dark:bg-slate-700'
        }`}
        style={filterType === 'expense' ? {
          backgroundColor: '#FEF2F2',
          borderWidth: 2,
          borderColor: '#FECACA',
        } : undefined}
      >
        <Text
          className={`text-center font-medium ${
            filterType === 'expense'
              ? 'text-red-700 dark:text-red-400'
              : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          Expenses
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onSelect('revenue')}
        className={`flex-1 py-2 px-4 rounded-xl ${
          filterType === 'revenue' ? '' : 'bg-gray-100 dark:bg-slate-700'
        }`}
        style={filterType === 'revenue' ? {
          backgroundColor: '#F0FDF4',
          borderWidth: 2,
          borderColor: '#BBF7D0',
        } : undefined}
      >
        <Text
          className={`text-center font-medium ${
            filterType === 'revenue'
              ? 'text-green-700 dark:text-green-400'
              : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          Revenue
        </Text>
      </TouchableOpacity>
    </View>
  );
};

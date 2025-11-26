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
          filterType === 'all'
            ? 'bg-indigo-600 dark:bg-indigo-500'
            : 'bg-gray-100 dark:bg-slate-700'
        }`}
      >
        <Text
          className={`text-center font-medium ${
            filterType === 'all'
              ? 'text-white'
              : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          All
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onSelect('expense')}
        className={`flex-1 py-2 px-4 rounded-xl ${
          filterType === 'expense'
            ? 'bg-red-500'
            : 'bg-gray-100 dark:bg-slate-700'
        }`}
      >
        <Text
          className={`text-center font-medium ${
            filterType === 'expense'
              ? 'text-white'
              : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          Expenses
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onSelect('revenue')}
        className={`flex-1 py-2 px-4 rounded-xl ${
          filterType === 'revenue'
            ? 'bg-green-500'
            : 'bg-gray-100 dark:bg-slate-700'
        }`}
      >
        <Text
          className={`text-center font-medium ${
            filterType === 'revenue'
              ? 'text-white'
              : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          Revenue
        </Text>
      </TouchableOpacity>
    </View>
  );
};

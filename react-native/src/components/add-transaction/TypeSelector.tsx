import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react-native';

interface TypeSelectorProps {
  type: 'expense' | 'revenue';
  onTypeChange: (type: 'expense' | 'revenue') => void;
  isDark?: boolean;
  disabled?: boolean;
}

export const TypeSelector: React.FC<TypeSelectorProps> = ({ type, onTypeChange, isDark = false, disabled = false }) => {
  return (
    <View style={{ opacity: disabled ? 0.6 : 1 }}>
      <Text className="text-gray-700 dark:text-gray-300 font-medium mb-3">
        Transaction Type
      </Text>
      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={() => onTypeChange('expense')}
          disabled={disabled}
          className={`flex-1 py-3 rounded-xl flex-row items-center justify-center gap-2 ${
            type === 'expense' ? 'bg-red-500' : 'bg-gray-100 dark:bg-slate-700'
          }`}
        >
          <ArrowUpCircle 
            size={20} 
            color={type === 'expense' ? '#FFF' : isDark ? '#D1D5DB' : '#374151'} 
          />
          <Text
            className={`text-center font-semibold ${
              type === 'expense' ? 'text-white' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            Expense
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onTypeChange('revenue')}
          disabled={disabled}
          className={`flex-1 py-3 rounded-xl flex-row items-center justify-center gap-2 ${
            type === 'revenue' ? 'bg-green-500' : 'bg-gray-100 dark:bg-slate-700'
          }`}
        >
          <ArrowDownCircle 
            size={20} 
            color={type === 'revenue' ? '#FFF' : isDark ? '#D1D5DB' : '#374151'} 
          />
          <Text
            className={`text-center font-semibold ${
              type === 'revenue' ? 'text-white' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            Revenue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
            type === 'expense' ? '' : 'bg-gray-100 dark:bg-slate-700'
          }`}
          style={type === 'expense' ? {
            backgroundColor: '#FEF2F2',
            borderWidth: 2,
            borderColor: '#FECACA',
          } : undefined}
        >
          <ArrowUpCircle 
            size={20} 
            color={type === 'expense' ? '#B91C1C' : isDark ? '#D1D5DB' : '#374151'} 
          />
          <Text
            className={`text-center font-semibold ${
              type === 'expense' ? 'text-red-700 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            Expense
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onTypeChange('revenue')}
          disabled={disabled}
          className={`flex-1 py-3 rounded-xl flex-row items-center justify-center gap-2 ${
            type === 'revenue' ? '' : 'bg-gray-100 dark:bg-slate-700'
          }`}
          style={type === 'revenue' ? {
            backgroundColor: '#F0FDF4',
            borderWidth: 2,
            borderColor: '#BBF7D0',
          } : undefined}
        >
          <ArrowDownCircle 
            size={20} 
            color={type === 'revenue' ? '#15803D' : isDark ? '#D1D5DB' : '#374151'} 
          />
          <Text
            className={`text-center font-semibold ${
              type === 'revenue' ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            Revenue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

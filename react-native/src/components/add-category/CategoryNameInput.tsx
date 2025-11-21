import React from 'react';
import { TextInput } from 'react-native';

interface CategoryNameInputProps {
  value: string;
  onChangeText: (text: string) => void;
  color: string;
  isDark?: boolean;
}

export const CategoryNameInput: React.FC<CategoryNameInputProps> = ({
  value,
  onChangeText,
  color,
  isDark = false,
}) => {
  return (
    <TextInput
      className="bg-gray-50 dark:bg-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-base"
      placeholder="Enter category name"
      placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
      value={value}
      onChangeText={onChangeText}
      style={{ 
        borderWidth: 2,
        borderColor: value ? color : isDark ? '#334155' : '#E5E7EB'
      }}
    />
  );
};

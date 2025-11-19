import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  rightIcon,
  className = '',
  ...props
}) => {
  return (
    <View className="w-full">
      {label && (
        <Text className="text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
          {label}
        </Text>
      )}
      
      <View
        className={`
          flex-row
          items-center
          bg-gray-50
          dark:bg-slate-700
          border
          ${error ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'}
          rounded-xl
          px-4
          ${className}
        `}
      >
        {icon && <View className="mr-2">{icon}</View>}
        
        <TextInput
          className="flex-1 py-3 text-gray-900 dark:text-white text-base"
          placeholderTextColor="#9CA3AF"
          {...props}
        />
        
        {rightIcon && <View className="ml-2">{rightIcon}</View>}
      </View>
      
      {error && (
        <Text className="text-red-500 text-xs mt-1 ml-1">
          {error}
        </Text>
      )}
    </View>
  );
};

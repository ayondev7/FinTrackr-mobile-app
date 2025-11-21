import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return 'shadow-lg';
      case 'outlined':
        return 'border border-gray-200 dark:border-gray-700';
      default:
        return 'shadow-md';
    }
  };

  return (
    <View
      className={`
        bg-white
        dark:bg-slate-800
        rounded-2xl
        p-4
        ${getVariantStyles()}
        ${className}
      `}
      {...props}
    >
      {children}
    </View>
  );
};

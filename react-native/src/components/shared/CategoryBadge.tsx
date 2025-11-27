import React from 'react';
import { View, Text } from 'react-native';

interface CategoryBadgeProps {
  name: string;
  color: string;
  icon?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  name,
  color,
  icon,
  size = 'md',
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1';
      case 'md':
        return 'px-3 py-1.5';
      case 'lg':
        return 'px-4 py-2';
      default:
        return 'px-3 py-1.5';
    }
  };

  const getTextSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'text-xs';
      case 'md':
        return 'text-sm';
      case 'lg':
        return 'text-base';
      default:
        return 'text-sm';
    }
  };

  return (
    <View
      className={`
        ${getSizeStyles()}
        rounded-full
        flex-row
        items-center
        gap-1
        self-start
      `}
      style={{ backgroundColor: `${color}20` }}
    >
      <View
        className="w-1 h-1 rounded-full"
        style={{ backgroundColor: color }}
      />
      <Text
        className={`${getTextSizeStyles()} font-medium`}
        style={{ color }}
      >
        {name}
      </Text>
    </View>
  );
};

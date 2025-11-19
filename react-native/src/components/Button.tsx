import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { useThemeStore } from '../store/themeStore';
import { colors } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
}) => {
  const { theme } = useThemeStore();
  const themeColors = colors[theme];

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-indigo-600 dark:bg-indigo-500';
      case 'secondary':
        return 'bg-pink-600 dark:bg-pink-500';
      case 'outline':
        return 'bg-transparent border-2 border-indigo-600 dark:border-indigo-400';
      case 'ghost':
        return 'bg-transparent';
      default:
        return 'bg-indigo-600 dark:bg-indigo-500';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2';
      case 'md':
        return 'px-6 py-3';
      case 'lg':
        return 'px-8 py-4';
      default:
        return 'px-6 py-3';
    }
  };

  const getTextVariantStyles = () => {
    switch (variant) {
      case 'outline':
      case 'ghost':
        return 'text-indigo-600 dark:text-indigo-400';
      default:
        return 'text-white';
    }
  };

  const getTextSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'md':
        return 'text-base';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${fullWidth ? 'w-full' : ''}
        rounded-xl
        flex-row
        items-center
        justify-center
        ${disabled || loading ? 'opacity-50' : ''}
      `}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? themeColors.primary : '#FFFFFF'} />
      ) : (
        <View className="flex-row items-center gap-2">
          {icon && <View>{icon}</View>}
          <Text className={`${getTextVariantStyles()} ${getTextSizeStyles()} font-semibold`}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

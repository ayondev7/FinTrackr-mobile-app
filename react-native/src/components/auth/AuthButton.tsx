import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'social';
}

export const AuthButton: React.FC<AuthButtonProps> = ({ 
  title, 
  onPress, 
  variant = 'primary' 
}) => {
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`${isPrimary ? 'bg-indigo-600' : 'bg-white border-2 border-gray-200'} rounded-full p-5 items-center ${!isPrimary && 'mb-3'}`}
      style={isPrimary ? {
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
      } : {}}
    >
      <Text className={`text-lg font-bold ${isPrimary ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

import React from 'react';
import { View, Text } from 'react-native';

interface AuthInputProps {
  placeholder: string;
}

export const AuthInput: React.FC<AuthInputProps> = ({ placeholder }) => {
  return (
    <View className="bg-white rounded-2xl p-5 mb-4 border-2 border-gray-200">
      <Text className="text-gray-400 text-base">{placeholder}</Text>
    </View>
  );
};

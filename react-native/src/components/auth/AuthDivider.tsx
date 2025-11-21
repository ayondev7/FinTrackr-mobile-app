import React from 'react';
import { View, Text } from 'react-native';

export const AuthDivider: React.FC = () => {
  return (
    <View className="flex-row items-center my-8">
      <View className="flex-1 h-px bg-gray-200" />
      <Text className="text-gray-600 mx-4 text-base font-medium">or</Text>
      <View className="flex-1 h-px bg-gray-200" />
    </View>
  );
};

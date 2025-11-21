import React from 'react';
import { View, Text } from 'react-native';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
  return (
    <View className="items-center mb-10">
      <Text className="text-5xl font-bold text-gray-900 mb-3">
        FinTrackr
      </Text>
      <Text className="text-xl text-gray-600 font-semibold">
        {subtitle}
      </Text>
    </View>
  );
};

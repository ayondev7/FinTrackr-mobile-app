import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface AuthFooterProps {
  text: string;
  linkText: string;
  onPress?: () => void;
}

export const AuthFooter: React.FC<AuthFooterProps> = ({ text, linkText, onPress }) => {
  return (
    <View className="flex-row justify-center items-center">
      <Text className="text-gray-600 text-base mr-1">{text}</Text>
      <TouchableOpacity onPress={onPress}>
        <Text className="text-indigo-600 text-base font-bold">{linkText}</Text>
      </TouchableOpacity>
    </View>
  );
};

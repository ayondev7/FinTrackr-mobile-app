import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '../shared/Card';

interface ProfileCardProps {
  userName: string;
  userEmail?: string;
}

export const ProfileCard = ({ userName, userEmail }: ProfileCardProps) => {
  return (
    <Card className="mb-6 p-6">
      <View className="items-center mb-4">
        <View className="w-20 h-20 rounded-full bg-indigo-600 items-center justify-center mb-3">
          <Text className="text-white text-3xl font-bold">
            {userName.charAt(0)}
          </Text>
        </View>
        <Text className="text-gray-900 dark:text-white text-xl font-bold">
          {userName}
        </Text>
        {userEmail && (
          <Text className="text-gray-500 dark:text-gray-400 text-sm">
            {userEmail}
          </Text>
        )}
      </View>
    </Card>
  );
};

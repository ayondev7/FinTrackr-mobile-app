import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TrendingUp, HeartPulse, Activity } from 'lucide-react-native';
import { Card } from '../Card';

interface QuickActionsProps {
  warningColor: string;
  dangerColor: string;
  infoColor: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  warningColor,
  dangerColor,
  infoColor,
}) => {
  const navigation = useNavigation();

  return (
    <>
      <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Quick Actions
      </Text>
      <View className="flex-row gap-3 mb-6">
        <TouchableOpacity
          className="flex-1"
          onPress={() => navigation.navigate('Predictions' as never)}
          activeOpacity={0.7}
        >
          <Card className="p-4">
            <View
              className="w-10 h-10 rounded-xl items-center justify-center mb-2"
              style={{ backgroundColor: `${warningColor}20` }}
            >
              <TrendingUp size={20} color={warningColor} />
            </View>
            <Text className="text-gray-900 dark:text-white font-semibold text-sm mb-1">
              Predictions
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-xs">
              Forecast
            </Text>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1"
          onPress={() => navigation.navigate('Healthcare' as never)}
          activeOpacity={0.7}
        >
          <Card className="p-4">
            <View
              className="w-10 h-10 rounded-xl items-center justify-center mb-2"
              style={{ backgroundColor: `${dangerColor}20` }}
            >
              <HeartPulse size={20} color={dangerColor} />
            </View>
            <Text className="text-gray-900 dark:text-white font-semibold text-sm mb-1">
              Healthcare
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-xs">
              Medical
            </Text>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1"
          onPress={() => navigation.navigate('Categories' as never)}
          activeOpacity={0.7}
        >
          <Card className="p-4">
            <View
              className="w-10 h-10 rounded-xl items-center justify-center mb-2"
              style={{ backgroundColor: `${infoColor}20` }}
            >
              <Activity size={20} color={infoColor} />
            </View>
            <Text className="text-gray-900 dark:text-white font-semibold text-sm mb-1">
              Categories
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-xs">
              Manage
            </Text>
          </Card>
        </TouchableOpacity>
      </View>
    </>
  );
};

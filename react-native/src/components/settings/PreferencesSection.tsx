import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card } from '../Card';
import { DollarSign, Bell, Target, ChevronRight } from 'lucide-react-native';

interface PreferencesSectionProps {
  currency: string;
  successColor: string;
  infoColor: string;
  warningColor: string;
}

export const PreferencesSection = ({ currency, successColor, infoColor, warningColor }: PreferencesSectionProps) => {
  return (
    <>
      <Text className="text-gray-900 dark:text-white text-lg font-bold mb-4">
        Preferences
      </Text>
      <Card className="mb-6">
        <TouchableOpacity className="p-4 flex-row items-center justify-between border-b border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center gap-3">
            <View
              className="w-10 h-10 rounded-xl items-center justify-center"
              style={{ backgroundColor: `${successColor}20` }}
            >
              <DollarSign size={20} color={successColor} />
            </View>
            <View>
              <Text className="text-gray-900 dark:text-white font-semibold">
                Currency
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-xs">
                {currency}
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity className="p-4 flex-row items-center justify-between border-b border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center gap-3">
            <View
              className="w-10 h-10 rounded-xl items-center justify-center"
              style={{ backgroundColor: `${infoColor}20` }}
            >
              <Bell size={20} color={infoColor} />
            </View>
            <View>
              <Text className="text-gray-900 dark:text-white font-semibold">
                Notifications
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-xs">
                Manage alerts
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity className="p-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View
              className="w-10 h-10 rounded-xl items-center justify-center"
              style={{ backgroundColor: `${warningColor}20` }}
            >
              <Target size={20} color={warningColor} />
            </View>
            <View>
              <Text className="text-gray-900 dark:text-white font-semibold">
                Budget Settings
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-xs">
                Set spending limits
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </Card>
    </>
  );
};

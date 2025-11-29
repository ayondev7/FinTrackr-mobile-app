import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card } from '../shared/Card';
import { Bell, Target, ChevronRight, Wallet, Smartphone } from 'lucide-react-native';
import { getCurrencySymbol } from '../../utils';

interface PreferencesSectionProps {
  currency: string;
  successColor: string;
  infoColor: string;
  warningColor: string;
  primaryColor: string;
  onCurrencyPress: () => void;
  onNotificationPress: () => void;
  onBudgetPress: () => void;
  onAccountBalancesPress: () => void;
  onDeviceManagementPress: () => void;
}

export const PreferencesSection = ({ 
  currency, 
  successColor, 
  infoColor, 
  warningColor,
  primaryColor,
  onCurrencyPress,
  onNotificationPress,
  onBudgetPress,
  onAccountBalancesPress,
  onDeviceManagementPress
}: PreferencesSectionProps) => {
  const currencySymbol = getCurrencySymbol(currency);
  
  return (
    <>
      <Text className="text-gray-900 dark:text-white text-lg font-bold mb-4">
        Preferences
      </Text>
      <Card className="mb-6">
        <TouchableOpacity 
          className="p-4 flex-row items-center justify-between border-b border-gray-100 dark:border-gray-700"
          onPress={onCurrencyPress}
          activeOpacity={0.7}
        >
          <View className="flex-row items-center gap-3">
            <View
              className="w-10 h-10 rounded-xl items-center justify-center"
              style={{ backgroundColor: `${successColor}20` }}
            >
              <Text style={{ color: successColor, fontSize: 18, fontWeight: '700' }}>{currencySymbol}</Text>
            </View>
            <View>
              <Text className="text-gray-900 dark:text-white font-semibold">
                Currency
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-xs">
                {currencySymbol} ({currency})
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity 
          className="p-4 flex-row items-center justify-between border-b border-gray-100 dark:border-gray-700"
          onPress={onAccountBalancesPress}
          activeOpacity={0.7}
        >
          <View className="flex-row items-center gap-3">
            <View
              className="w-10 h-10 rounded-xl items-center justify-center"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <Wallet size={20} color={primaryColor} />
            </View>
            <View>
              <Text className="text-gray-900 dark:text-white font-semibold">
                Account Balances
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-xs">
                Edit cash, bank & digital
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity 
          className="p-4 flex-row items-center justify-between border-b border-gray-100 dark:border-gray-700"
          onPress={onNotificationPress}
          activeOpacity={0.7}
        >
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

        <TouchableOpacity 
          className="p-4 flex-row items-center justify-between border-b border-gray-100 dark:border-gray-700"
          onPress={onDeviceManagementPress}
          activeOpacity={0.7}
        >
          <View className="flex-row items-center gap-3">
            <View
              className="w-10 h-10 rounded-xl items-center justify-center"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <Smartphone size={20} color={primaryColor} />
            </View>
            <View>
              <Text className="text-gray-900 dark:text-white font-semibold">
                Manage Devices
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-xs">
                View connected devices
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity 
          className="p-4 flex-row items-center justify-between"
          onPress={onBudgetPress}
          activeOpacity={0.7}
        >
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

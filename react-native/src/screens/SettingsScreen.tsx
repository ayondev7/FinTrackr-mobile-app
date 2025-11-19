import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Card } from '../components';
import { useThemeStore, useUserStore } from '../store';
import { colors } from '../constants/theme';

export const SettingsScreen = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { user, updateUser } = useUserStore();
  const themeColors = colors[theme];

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-slate-900">
      <View className="p-6">
        <Text className="text-gray-900 dark:text-white text-3xl font-bold mb-6">
          Settings ⚙️
        </Text>

        <Card className="mb-6 p-6">
          <View className="items-center mb-4">
            <View className="w-20 h-20 rounded-full bg-indigo-600 items-center justify-center mb-3">
              <Text className="text-white text-3xl font-bold">
                {user.name.charAt(0)}
              </Text>
            </View>
            <Text className="text-gray-900 dark:text-white text-xl font-bold">
              {user.name}
            </Text>
            {user.email && (
              <Text className="text-gray-500 dark:text-gray-400 text-sm">
                {user.email}
              </Text>
            )}
          </View>
        </Card>

        <Text className="text-gray-900 dark:text-white text-lg font-bold mb-4">
          Appearance
        </Text>
        <Card className="mb-6">
          <TouchableOpacity
            className="p-4 flex-row items-center justify-between"
            onPress={toggleTheme}
          >
            <View className="flex-row items-center gap-3">
              <View
                className="w-10 h-10 rounded-xl items-center justify-center"
                style={{ backgroundColor: `${themeColors.primary}20` }}
              >
                <Text className="text-xl">{theme === 'light' ? '☀️' : '🌙'}</Text>
              </View>
              <View>
                <Text className="text-gray-900 dark:text-white font-semibold">
                  Dark Mode
                </Text>
                <Text className="text-gray-500 dark:text-gray-400 text-xs">
                  Toggle dark theme
                </Text>
              </View>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: '#D1D5DB', true: themeColors.primary }}
              thumbColor="#FFFFFF"
            />
          </TouchableOpacity>
        </Card>

        <Text className="text-gray-900 dark:text-white text-lg font-bold mb-4">
          Preferences
        </Text>
        <Card className="mb-6">
          <TouchableOpacity className="p-4 flex-row items-center justify-between border-b border-gray-100 dark:border-gray-700">
            <View className="flex-row items-center gap-3">
              <View
                className="w-10 h-10 rounded-xl items-center justify-center"
                style={{ backgroundColor: `${themeColors.success}20` }}
              >
                <Text className="text-xl">💰</Text>
              </View>
              <View>
                <Text className="text-gray-900 dark:text-white font-semibold">
                  Currency
                </Text>
                <Text className="text-gray-500 dark:text-gray-400 text-xs">
                  {user.currency}
                </Text>
              </View>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="p-4 flex-row items-center justify-between border-b border-gray-100 dark:border-gray-700">
            <View className="flex-row items-center gap-3">
              <View
                className="w-10 h-10 rounded-xl items-center justify-center"
                style={{ backgroundColor: `${themeColors.info}20` }}
              >
                <Text className="text-xl">🔔</Text>
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
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="p-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View
                className="w-10 h-10 rounded-xl items-center justify-center"
                style={{ backgroundColor: `${themeColors.warning}20` }}
              >
                <Text className="text-xl">🎯</Text>
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
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>
        </Card>

        <Text className="text-gray-900 dark:text-white text-lg font-bold mb-4">
          Data & Privacy
        </Text>
        <Card className="mb-6">
          <TouchableOpacity className="p-4 flex-row items-center justify-between border-b border-gray-100 dark:border-gray-700">
            <View className="flex-row items-center gap-3">
              <View
                className="w-10 h-10 rounded-xl items-center justify-center"
                style={{ backgroundColor: `${themeColors.primary}20` }}
              >
                <Text className="text-xl">📤</Text>
              </View>
              <View>
                <Text className="text-gray-900 dark:text-white font-semibold">
                  Export Data
                </Text>
                <Text className="text-gray-500 dark:text-gray-400 text-xs">
                  Download as CSV
                </Text>
              </View>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="p-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View
                className="w-10 h-10 rounded-xl items-center justify-center"
                style={{ backgroundColor: `${themeColors.danger}20` }}
              >
                <Text className="text-xl">🗑️</Text>
              </View>
              <View>
                <Text className="text-gray-900 dark:text-white font-semibold">
                  Clear Data
                </Text>
                <Text className="text-gray-500 dark:text-gray-400 text-xs">
                  Reset all transactions
                </Text>
              </View>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>
        </Card>

        <Text className="text-gray-500 dark:text-gray-400 text-center text-sm mb-4">
          FinTrackr v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
};

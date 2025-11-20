import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '../components';
import { useThemeStore, useUserStore } from '../store';
import { colors } from '../constants/theme';
import { 
  User, 
  Moon, 
  Sun, 
  DollarSign, 
  Bell, 
  Target, 
  Download, 
  Trash2, 
  ChevronRight,
  Settings
} from 'lucide-react-native';

export const SettingsScreen = () => {
  const insets = useSafeAreaInsets();
  const { theme, toggleTheme } = useThemeStore();
  const { user, updateUser } = useUserStore();
  const themeColors = colors[theme];
  const isDark = theme === 'dark';

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-slate-900">
      <View className="p-6" style={{ paddingTop: insets.top + 24 }}>
        <View className="flex-row items-center gap-3 mb-6">
          <Text className="text-gray-900 dark:text-white text-3xl font-bold">
            Settings
          </Text>
          <Settings size={28} color={isDark ? '#FFF' : '#111827'} />
        </View>

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
                {theme === 'light' ? (
                  <Sun size={20} color={themeColors.primary} />
                ) : (
                  <Moon size={20} color={themeColors.primary} />
                )}
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
                <DollarSign size={20} color={themeColors.success} />
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
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity className="p-4 flex-row items-center justify-between border-b border-gray-100 dark:border-gray-700">
            <View className="flex-row items-center gap-3">
              <View
                className="w-10 h-10 rounded-xl items-center justify-center"
                style={{ backgroundColor: `${themeColors.info}20` }}
              >
                <Bell size={20} color={themeColors.info} />
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
                style={{ backgroundColor: `${themeColors.warning}20` }}
              >
                <Target size={20} color={themeColors.warning} />
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
                <Download size={20} color={themeColors.primary} />
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
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity className="p-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View
                className="w-10 h-10 rounded-xl items-center justify-center"
                style={{ backgroundColor: `${themeColors.danger}20` }}
              >
                <Trash2 size={20} color={themeColors.danger} />
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
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </Card>

        <Text className="text-gray-500 dark:text-gray-400 text-center text-sm mb-4">
          FinTrackr v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
};

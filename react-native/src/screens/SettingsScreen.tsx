import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore, useUserStore } from '../store';
import { colors } from '../constants/theme';
import { Settings } from 'lucide-react-native';
import { 
  ProfileCard, 
  ThemeSection, 
  PreferencesSection, 
  DataPrivacySection 
} from '../components/settings';

export const SettingsScreen = () => {
  const insets = useSafeAreaInsets();
  const { theme, toggleTheme } = useThemeStore();
  const { user, updateUser } = useUserStore();
  const themeColors = colors[theme];
  const isDark = theme === 'dark';

  return (
    <ScrollView 
      className="flex-1 bg-gray-50 dark:bg-slate-900"
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <View className="p-6" style={{ paddingTop: insets.top + 24 }}>
        <View className="flex-row items-center gap-3 mb-6">
          <Text className="text-gray-900 dark:text-white text-3xl font-bold">
            Settings
          </Text>
          <Settings size={28} color={isDark ? '#FFF' : '#111827'} />
        </View>

        <ProfileCard userName={user.name} userEmail={user.email} />

        <ThemeSection 
          theme={theme} 
          primaryColor={themeColors.primary} 
          toggleTheme={toggleTheme} 
        />

        <PreferencesSection
          currency={user.currency}
          successColor={themeColors.success}
          infoColor={themeColors.info}
          warningColor={themeColors.warning}
        />

        <DataPrivacySection
          primaryColor={themeColors.primary}
          dangerColor={themeColors.danger}
        />

        <Text className="text-gray-500 dark:text-gray-400 text-center text-sm mb-4">
          FinTrackr v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
};

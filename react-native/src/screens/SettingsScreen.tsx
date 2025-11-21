import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore, useUserStore, useTransactionStore, useCategoryStore } from '../store';
import { colors } from '../constants/theme';
import { Settings } from 'lucide-react-native';
import { 
  ProfileCard, 
  ThemeSection, 
  PreferencesSection, 
  DataPrivacySection,
  CurrencyModal,
  NotificationModal,
  BudgetModal,
  ExportModal,
  ClearDataModal
} from '../components/settings';

export const SettingsScreen = () => {
  const insets = useSafeAreaInsets();
  const { theme, toggleTheme } = useThemeStore();
  const { user, updateUser } = useUserStore();
  const { transactions, clearTransactions } = useTransactionStore();
  const { categories } = useCategoryStore();
  const themeColors = colors[theme];
  const isDark = theme === 'dark';

  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [clearDataModalVisible, setClearDataModalVisible] = useState(false);

  const [notificationSettings, setNotificationSettings] = useState({
    transactions: true,
    budgetAlerts: true,
    monthlyReports: false,
    reminderAlerts: true,
  });

  const handleCurrencySelect = (currency: string) => {
    updateUser({ currency });
  };

  const handleNotificationUpdate = (key: string, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleExportData = (format: 'csv' | 'json' | 'pdf') => {
    console.log(`Exporting data as ${format}`);
  };

  const handleClearData = () => {
    clearTransactions();
  };

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
          onCurrencyPress={() => setCurrencyModalVisible(true)}
          onNotificationPress={() => setNotificationModalVisible(true)}
          onBudgetPress={() => setBudgetModalVisible(true)}
        />

        <DataPrivacySection
          primaryColor={themeColors.primary}
          dangerColor={themeColors.danger}
          onExportPress={() => setExportModalVisible(true)}
          onClearPress={() => setClearDataModalVisible(true)}
        />

        <Text className="text-gray-500 dark:text-gray-400 text-center text-sm mb-4">
          FinTrackr v1.0.0
        </Text>
      </View>

      <CurrencyModal
        visible={currencyModalVisible}
        onClose={() => setCurrencyModalVisible(false)}
        selectedCurrency={user.currency}
        onSelect={handleCurrencySelect}
      />

      <NotificationModal
        visible={notificationModalVisible}
        onClose={() => setNotificationModalVisible(false)}
        settings={notificationSettings}
        onUpdate={handleNotificationUpdate}
        primaryColor={themeColors.primary}
      />

      <BudgetModal
        visible={budgetModalVisible}
        onClose={() => setBudgetModalVisible(false)}
        warningColor={themeColors.warning}
      />

      <ExportModal
        visible={exportModalVisible}
        onClose={() => setExportModalVisible(false)}
        primaryColor={themeColors.primary}
        onExport={handleExportData}
      />

      <ClearDataModal
        visible={clearDataModalVisible}
        onClose={() => setClearDataModalVisible(false)}
        dangerColor={themeColors.danger}
        onClearData={handleClearData}
      />
    </ScrollView>
  );
};

import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useThemeStore, useTransactionStore, useOnboardingStore, useToastStore } from '../store';
import { colors } from '../constants/theme';
import { Settings, MessageSquare, LogOut } from 'lucide-react-native';
import { clearTokens } from '../utils/authStorage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { config } from '../config';
import { useUserProfile, useUpdateProfile, useClearUserData, useExportUserData } from '../hooks';
import { CURRENCIES } from '../constants';
import { 
  ProfileCard, 
  ThemeSection, 
  PreferencesSection, 
  DataPrivacySection,
  CurrencyModal,
  NotificationModal,
  ExportModal,
  ClearDataModal
} from '../components/settings';
import { RefreshableScrollView, Loader } from '../components/shared';

export const SettingsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { theme, toggleTheme } = useThemeStore();
  const { transactions, clearTransactions } = useTransactionStore();
  const { logout, reset: resetOnboarding } = useOnboardingStore();
  const { showSuccess, showError } = useToastStore();
  const themeColors = colors[theme];
  const isDark = theme === 'dark';

  const { data: userResponse, isLoading, refetch } = useUserProfile();
  const updateProfile = useUpdateProfile();
  const clearUserData = useClearUserData();
  const exportUserData = useExportUserData();
  const user = userResponse?.data;

  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [clearDataModalVisible, setClearDataModalVisible] = useState(false);

  const [notificationSettings, setNotificationSettings] = useState({
    transactions: true,
    budgetAlerts: true,
    monthlyReports: false,
    reminderAlerts: true,
  });

  const handleRefresh = async () => {
    await refetch();
  };

  const handleCurrencySelect = async (currency: string) => {
    const currencyInfo = CURRENCIES.find(c => c.code === currency);
    const currencyName = currencyInfo?.name || currency;
    
    try {
      await updateProfile.mutateAsync({ currency });
      showSuccess('Currency Updated', `Your currency has been changed to ${currencyName} (${currencyInfo?.symbol || currency})`);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update currency';
      showError('Update Failed', errorMessage);
    }
  };

  const handleNotificationUpdate = (key: string, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleExportData = async (format: 'csv' | 'json' | 'pdf') => {
    try {
      const result = await exportUserData.mutateAsync();
      showSuccess('Export Ready', `Your data is ready to be saved as ${format.toUpperCase()}.`);
      return result.data;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to export data';
      showError('Export Failed', errorMessage);
      return null;
    }
  };

  const handleClearData = async () => {
    try {
      const result = await clearUserData.mutateAsync();
      setClearDataModalVisible(false);
      clearTransactions(); // Clear local store as well
      
      const data = result.data;
      showSuccess(
        'Data Cleared',
        `Deleted ${data.deletedTransactions} transactions, ${data.deletedBudgets} budgets, and ${data.deletedCategories} categories. Balances reset to 0.`
      );
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to clear data';
      showError('Error', errorMessage);
    }
  };

  const handleResetOnboarding = () => {
    Alert.alert(
      'Reset Onboarding',
      'This will log you out and show the onboarding screens again. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => resetOnboarding()
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              GoogleSignin.configure({
                webClientId: config.google.webClientId,
              });
              await GoogleSignin.signOut();
            } catch (error) {
              console.error('Error signing out of Google:', error);
            }
            await clearTokens();
            logout();
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View 
        className="flex-1 bg-gray-50 dark:bg-slate-900 justify-center items-center"
        style={{ paddingTop: insets.top }}
      >
        <Loader size={64} />
      </View>
    );
  }

  return (
    <RefreshableScrollView 
      className="flex-1 bg-gray-50 dark:bg-slate-900"
      contentContainerStyle={{ paddingBottom: 100 }}
      onRefresh={handleRefresh}
    >
      <View className="p-6" style={{ paddingTop: insets.top + 24 }}>
        <View className="flex-row items-center gap-3 mb-6">
          <Text className="text-gray-900 dark:text-white text-3xl font-bold">
            Settings
          </Text>
          <Settings size={28} color={isDark ? '#FFF' : '#111827'} />
        </View>

        <ProfileCard 
          userName={user?.name || 'User'} 
          userEmail={user?.email} 
          userImage={user?.image}
        />

        <ThemeSection 
          theme={theme} 
          primaryColor={themeColors.primary} 
          toggleTheme={toggleTheme} 
        />

        <PreferencesSection
          currency={user?.currency || 'USD'}
          successColor={themeColors.success}
          infoColor={themeColors.info}
          warningColor={themeColors.warning}
          onCurrencyPress={() => setCurrencyModalVisible(true)}
          onNotificationPress={() => setNotificationModalVisible(true)}
          onBudgetPress={() => navigation.navigate('Budgets' as never)}
        />

        <DataPrivacySection
          primaryColor={themeColors.primary}
          dangerColor={themeColors.danger}
          onExportPress={() => setExportModalVisible(true)}
          onClearPress={() => setClearDataModalVisible(true)}
        />

        <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-6">
          <Text className="text-gray-900 dark:text-white text-lg font-semibold mb-3">
            Developer Options
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('ToastTest' as never)}
            className="bg-indigo-500 p-4 rounded-xl mb-3 flex-row items-center justify-center gap-2"
          >
            <MessageSquare size={20} color="#FFF" />
            <Text className="text-white text-center font-semibold">
              Test Toast Notifications
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleResetOnboarding}
            className="bg-orange-500 p-4 rounded-xl"
          >
            <Text className="text-white text-center font-semibold">
              Reset Onboarding
            </Text>
          </TouchableOpacity>
        </View>

        <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-6">
          <Text className="text-gray-900 dark:text-white text-lg font-semibold mb-3">
            Account
          </Text>
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-500 p-4 rounded-xl flex-row items-center justify-center gap-2"
          >
            <LogOut size={20} color="#FFF" />
            <Text className="text-white text-center font-semibold">
              Logout
            </Text>
          </TouchableOpacity>
        </View>

        <Text className="text-gray-500 dark:text-gray-400 text-center text-sm mb-4">
          FinTrackr v1.0.0
        </Text>
      </View>

      <CurrencyModal
        visible={currencyModalVisible}
        onClose={() => setCurrencyModalVisible(false)}
        selectedCurrency={user?.currency || 'USD'}
        onSelect={handleCurrencySelect}
      />

      <NotificationModal
        visible={notificationModalVisible}
        onClose={() => setNotificationModalVisible(false)}
        settings={notificationSettings}
        onUpdate={handleNotificationUpdate}
        primaryColor={themeColors.primary}
      />

      <ExportModal
        visible={exportModalVisible}
        onClose={() => setExportModalVisible(false)}
        primaryColor={themeColors.primary}
        onExport={handleExportData}
        isLoading={exportUserData.isPending}
      />

      <ClearDataModal
        visible={clearDataModalVisible}
        onClose={() => setClearDataModalVisible(false)}
        dangerColor={themeColors.danger}
        onClearData={handleClearData}
        isLoading={clearUserData.isPending}
      />
    </RefreshableScrollView>
  );
};

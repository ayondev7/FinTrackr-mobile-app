import React, { useState } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useThemeStore, useTransactionStore, useOnboardingStore, useToastStore } from '../store';
import { colors } from '../constants/theme';
import { Settings, LogOut } from 'lucide-react-native';
import { clearTokens } from '../utils/authStorage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { config } from '../config';
import { useUserProfile, useUpdateProfile, useClearUserData, useExportUserData, useUpdateBalance, useUpdateNotificationSettings, useNotifications } from '../hooks';
import { CURRENCIES } from '../constants';
import { NotificationSettings } from '../types';
import { 
  ProfileCard, 
  ThemeSection, 
  PreferencesSection, 
  DataPrivacySection,
  CurrencyModal,
  NotificationModal,
  ExportModal,
  ClearDataModal,
  AccountBalancesModal,
  DeviceManagementModal
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
  const updateBalance = useUpdateBalance();
  const clearUserData = useClearUserData();
  const exportUserData = useExportUserData();
  const updateNotificationSettings = useUpdateNotificationSettings();
  const { unregisterDeviceFromBackend } = useNotifications();
  const user = userResponse?.data;

  const [notificationLoadingKey, setNotificationLoadingKey] = useState<keyof NotificationSettings | null>(null);

  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [clearDataModalVisible, setClearDataModalVisible] = useState(false);
  const [accountBalancesModalVisible, setAccountBalancesModalVisible] = useState(false);
  const [deviceManagementModalVisible, setDeviceManagementModalVisible] = useState(false);

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

  const handleAccountBalancesUpdate = async (cash: number, bank: number, digital: number) => {
    try {
      await updateBalance.mutateAsync({
        cashBalance: cash,
        bankBalance: bank,
        digitalBalance: digital,
      });
      setAccountBalancesModalVisible(false);
      showSuccess('Balances Updated', 'Your account balances have been successfully updated.');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update balances';
      showError('Update Failed', errorMessage);
    }
  };

  const handleNotificationUpdate = async (key: keyof NotificationSettings, value: boolean) => {
    try {
      setNotificationLoadingKey(key);
      await updateNotificationSettings.mutateAsync({ [key]: value });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update notification settings';
      showError('Update Failed', errorMessage);
    } finally {
      setNotificationLoadingKey(null);
    }
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

  // Reset onboarding removed from Developer Options

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
              await unregisterDeviceFromBackend();
            } catch (error) {
              console.error('Error unregistering device:', error);
            }
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
          primaryColor={themeColors.primary}
          onCurrencyPress={() => setCurrencyModalVisible(true)}
          onNotificationPress={() => setNotificationModalVisible(true)}
          onBudgetPress={() => navigation.navigate('Budgets' as never)}
          onAccountBalancesPress={() => setAccountBalancesModalVisible(true)}
          onDeviceManagementPress={() => setDeviceManagementModalVisible(true)}
        />

        <DataPrivacySection
          primaryColor={themeColors.primary}
          dangerColor={themeColors.danger}
          onExportPress={() => setExportModalVisible(true)}
          onClearPress={() => setClearDataModalVisible(true)}
        />

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
        settings={{
          notifyTransactions: user?.notifyTransactions ?? true,
          notifyBudgetAlerts: user?.notifyBudgetAlerts ?? true,
          notifyMonthlyReports: user?.notifyMonthlyReports ?? false,
        }}
        onUpdate={handleNotificationUpdate}
        primaryColor={themeColors.primary}
        isLoading={updateNotificationSettings.isPending}
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

      <AccountBalancesModal
        visible={accountBalancesModalVisible}
        onClose={() => setAccountBalancesModalVisible(false)}
        cashBalance={user?.cashBalance || 0}
        bankBalance={user?.bankBalance || 0}
        digitalBalance={user?.digitalBalance || 0}
        currencySymbol={CURRENCIES.find(c => c.code === user?.currency)?.symbol || '$'}
        onUpdate={handleAccountBalancesUpdate}
        isLoading={updateBalance.isPending}
      />

      <DeviceManagementModal
        visible={deviceManagementModalVisible}
        onClose={() => setDeviceManagementModalVisible(false)}
        primaryColor={themeColors.primary}
        dangerColor={themeColors.danger}
      />
    </RefreshableScrollView>
  );
};

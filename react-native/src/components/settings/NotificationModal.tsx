import React from 'react';
import { View, Text, Modal, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { X, Bell, TrendingDown, Calendar, AlertCircle } from 'lucide-react-native';
import { Card } from '../Card';

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
  settings: {
    transactions: boolean;
    budgetAlerts: boolean;
    monthlyReports: boolean;
    reminderAlerts: boolean;
  };
  onUpdate: (key: string, value: boolean) => void;
  primaryColor: string;
}

export const NotificationModal = ({ visible, onClose, settings, onUpdate, primaryColor }: NotificationModalProps) => {
  const notificationOptions = [
    {
      key: 'transactions',
      icon: Bell,
      title: 'Transaction Notifications',
      description: 'Get notified when transactions are added',
      value: settings.transactions,
    },
    {
      key: 'budgetAlerts',
      icon: TrendingDown,
      title: 'Budget Alerts',
      description: 'Alert when approaching budget limits',
      value: settings.budgetAlerts,
    },
    {
      key: 'monthlyReports',
      icon: Calendar,
      title: 'Monthly Reports',
      description: 'Receive monthly spending summaries',
      value: settings.monthlyReports,
    },
    {
      key: 'reminderAlerts',
      icon: AlertCircle,
      title: 'Bill Reminders',
      description: 'Remind about upcoming bills',
      value: settings.reminderAlerts,
    },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <View className="flex-1 mt-20 bg-gray-50 dark:bg-slate-900 rounded-t-3xl">
          <View className="flex-row items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <Text className="text-gray-900 dark:text-white text-xl font-bold">
              Notifications
            </Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <ScrollView className="flex-1 p-6">
            <View className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
              <Text className="text-blue-800 dark:text-blue-300 text-sm">
                Manage which notifications you'd like to receive
              </Text>
            </View>

            {notificationOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Card key={option.key} className="mb-3 p-4">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3 flex-1">
                      <View
                        className="w-10 h-10 rounded-xl items-center justify-center"
                        style={{ backgroundColor: `${primaryColor}20` }}
                      >
                        <Icon size={20} color={primaryColor} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-gray-900 dark:text-white font-semibold mb-1">
                          {option.title}
                        </Text>
                        <Text className="text-gray-500 dark:text-gray-400 text-xs">
                          {option.description}
                        </Text>
                      </View>
                    </View>
                    <Switch
                      value={option.value}
                      onValueChange={(value) => onUpdate(option.key, value)}
                      trackColor={{ false: '#D1D5DB', true: primaryColor }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                </Card>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { X, Smartphone, Trash2, Clock } from 'lucide-react-native';
import { Card } from '../shared/Card';
import { useDevices, useRemoveDevice } from '../../hooks';
import * as Application from 'expo-application';
import { Platform } from 'react-native';
import { DeviceToken } from '../../types';

interface DeviceManagementModalProps {
  visible: boolean;
  onClose: () => void;
  primaryColor: string;
  dangerColor: string;
}

const formatLastActive = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString();
};

export const DeviceManagementModal = ({
  visible,
  onClose,
  primaryColor,
  dangerColor,
}: DeviceManagementModalProps) => {
  const { data: devicesResponse, isLoading } = useDevices();
  const removeDevice = useRemoveDevice();
  const devices = devicesResponse?.data || [];
  const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);

  useEffect(() => {
    const getDeviceId = async () => {
      if (Platform.OS === 'ios') {
        const id = await Application.getIosIdForVendorAsync();
        setCurrentDeviceId(id);
      } else {
        setCurrentDeviceId(Application.getAndroidId());
      }
    };
    getDeviceId();
  }, []);

  const handleRemoveDevice = (device: DeviceToken) => {
    if (device.deviceId === currentDeviceId) {
      Alert.alert(
        'Cannot Remove',
        'You cannot remove the device you are currently using. Log out instead.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Remove Device',
      `Are you sure you want to remove "${device.deviceName || 'Unknown Device'}"? This device will no longer receive push notifications.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeDevice.mutate(device.deviceId),
        },
      ]
    );
  };

  const DeviceIcon = ({ platform }: { platform: string }) => {
    const Icon = platform === 'ios' ? Smartphone : Smartphone;
    return <Icon size={24} color={primaryColor} />;
  };

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
              Manage Devices
            </Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-6">
            <View className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
              <Text className="text-blue-800 dark:text-blue-300 text-sm">
                These devices are registered to receive push notifications for your account.
              </Text>
            </View>

            {isLoading ? (
              <View className="items-center justify-center py-12">
                <ActivityIndicator size="large" color={primaryColor} />
                <Text className="text-gray-500 dark:text-gray-400 mt-4">
                  Loading devices...
                </Text>
              </View>
            ) : devices.length === 0 ? (
              <View className="items-center justify-center py-12">
                <Smartphone size={48} color="#9CA3AF" />
                <Text className="text-gray-500 dark:text-gray-400 mt-4 text-center">
                  No devices registered yet.{'\n'}Push notifications will appear here.
                </Text>
              </View>
            ) : (
              devices.map((device) => {
                const isCurrentDevice = device.deviceId === currentDeviceId;
                
                return (
                  <Card key={device.id} className="mb-3 p-4">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-3 flex-1">
                        <View
                          className="w-12 h-12 rounded-xl items-center justify-center"
                          style={{ backgroundColor: `${primaryColor}20` }}
                        >
                          <DeviceIcon platform={device.platform} />
                        </View>
                        <View className="flex-1">
                          <View className="flex-row items-center gap-2">
                            <Text className="text-gray-900 dark:text-white font-semibold">
                              {device.deviceName || 'Unknown Device'}
                            </Text>
                            {isCurrentDevice && (
                              <View 
                                className="px-2 py-0.5 rounded-full"
                                style={{ backgroundColor: `${primaryColor}20` }}
                              >
                                <Text 
                                  className="text-xs font-medium"
                                  style={{ color: primaryColor }}
                                >
                                  This device
                                </Text>
                              </View>
                            )}
                          </View>
                          <View className="flex-row items-center gap-1 mt-1">
                            <Clock size={12} color="#9CA3AF" />
                            <Text className="text-gray-500 dark:text-gray-400 text-xs">
                              {formatLastActive(device.lastActiveAt)}
                            </Text>
                            <Text className="text-gray-400 dark:text-gray-500 text-xs mx-1">•</Text>
                            <Text className="text-gray-500 dark:text-gray-400 text-xs capitalize">
                              {device.platform}
                            </Text>
                          </View>
                        </View>
                      </View>
                      
                      {!isCurrentDevice && (
                        <TouchableOpacity
                          onPress={() => handleRemoveDevice(device)}
                          disabled={removeDevice.isPending}
                          className="p-2"
                        >
                          {removeDevice.isPending ? (
                            <ActivityIndicator size="small" color={dangerColor} />
                          ) : (
                            <Trash2 size={20} color={dangerColor} />
                          )}
                        </TouchableOpacity>
                      )}
                    </View>
                  </Card>
                );
              })
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

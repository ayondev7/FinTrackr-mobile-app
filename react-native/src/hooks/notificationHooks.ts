import { useEffect, useRef, useState, useCallback } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import { useRegisterDevice, useUnregisterDevice } from './userHooks';
import { useUserStore } from '../store/userStore';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const getDeviceId = async (): Promise<string> => {
  if (Platform.OS === 'android') {
    return Application.getAndroidId() || `android-${Date.now()}`;
  }
  
  const iosId = await Application.getIosIdForVendorAsync();
  return iosId || `ios-${Date.now()}`;
};

const getDeviceName = (): string => {
  const brand = Device.brand || 'Unknown';
  const modelName = Device.modelName || 'Device';
  return `${brand} ${modelName}`;
};

export interface NotificationData {
  type: 'transaction' | 'budget_warning' | 'budget_exceeded' | 'monthly_report';
  transactionId?: string;
  categoryName?: string;
  budgetId?: string;
  screen?: string;
}

export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<Notifications.PermissionStatus | null>(null);
  const notificationListener = useRef<Notifications.EventSubscription | undefined>(undefined);
  const responseListener = useRef<Notifications.EventSubscription | undefined>(undefined);
  const isRegisteringRef = useRef<boolean>(false);
  const hasRegisteredRef = useRef<boolean>(false);

  const registerDevice = useRegisterDevice();
  const unregisterDevice = useUnregisterDevice();

  const registerForPushNotifications = useCallback(async (): Promise<string | null> => {
    if (!Device.isDevice) {
      console.log('Push notifications require a physical device');
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    setPermissionStatus(finalStatus);

    if (finalStatus !== 'granted') {
      console.log('Push notification permission not granted');
      return null;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4F46E5',
      });
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    return tokenData.data;
  }, []);

  const registerDeviceWithBackend = useCallback(async () => {
    // Prevent duplicate registrations
    if (isRegisteringRef.current || hasRegisteredRef.current) {
      return;
    }

    isRegisteringRef.current = true;

    try {
      const token = await registerForPushNotifications();
      if (!token) {
        isRegisteringRef.current = false;
        return;
      }

      setExpoPushToken(token);

      const currentDeviceId = await getDeviceId();
      setDeviceId(currentDeviceId);

      const deviceName = getDeviceName();
      const platform = Platform.OS as 'ios' | 'android';

      await registerDevice.mutateAsync({
        deviceId: currentDeviceId,
        expoPushToken: token,
        deviceName,
        platform,
      });

      hasRegisteredRef.current = true;
      console.log('Device registered for push notifications');
    } catch (error) {
      console.error('Failed to register device:', error);
    } finally {
      isRegisteringRef.current = false;
    }
  }, [registerForPushNotifications]);

  const unregisterDeviceFromBackend = useCallback(async () => {
    try {
      // Get the device ID fresh - don't rely on state which might be stale
      const currentDeviceId = deviceId || await getDeviceId();
      
      if (!currentDeviceId) {
        console.log('No device ID available for unregister');
        return;
      }

      await unregisterDevice.mutateAsync(currentDeviceId);
      hasRegisteredRef.current = false; // Allow re-registration after unregister
      console.log('Device unregistered from push notifications');
    } catch (error) {
      console.error('Failed to unregister device:', error);
      // Still reset the flag to allow re-registration even if unregister fails
      hasRegisteredRef.current = false;
    }
  }, [deviceId]);

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener((notification: Notifications.Notification) => {
      console.log('Notification received:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response: Notifications.NotificationResponse) => {
      const data = response.notification.request.content.data as unknown as NotificationData;
      console.log('Notification tapped:', data);
      
      // Handle navigation based on notification type
      // This will be enhanced later with navigation integration
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  return {
    expoPushToken,
    deviceId,
    permissionStatus,
    registerDeviceWithBackend,
    unregisterDeviceFromBackend,
    isRegistering: registerDevice.isPending,
    isUnregistering: unregisterDevice.isPending,
  };
};

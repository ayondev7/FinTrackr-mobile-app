import {
  EXPO_PUBLIC_API_BASE_URL,
  GOOGLE_EXPO_CLIENT_ID,
  GOOGLE_IOS_CLIENT_ID,
  GOOGLE_ANDROID_CLIENT_ID,
  GOOGLE_WEB_CLIENT_ID,
} from '@env';

export const config = {
  apiBaseUrl: EXPO_PUBLIC_API_BASE_URL || 'http://192.168.0.105:5000',
  google: {
    expoClientId: GOOGLE_EXPO_CLIENT_ID || '',
    iosClientId: GOOGLE_IOS_CLIENT_ID || '',
    androidClientId: GOOGLE_ANDROID_CLIENT_ID || '',
    webClientId: GOOGLE_WEB_CLIENT_ID || '',
  },
};

export default config;

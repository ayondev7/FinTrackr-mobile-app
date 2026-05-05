import {
  EXPO_PUBLIC_API_BASE_URL,
  GOOGLE_ANDROID_CLIENT_ID,
  GOOGLE_WEB_CLIENT_ID,
} from '@env';

export const config = {
  apiBaseUrl: EXPO_PUBLIC_API_BASE_URL,
  google: {
    androidClientId: GOOGLE_ANDROID_CLIENT_ID || '',
    webClientId: GOOGLE_WEB_CLIENT_ID || '',
  },
};

export default config;

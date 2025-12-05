
export const config = {
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
  google: {
    androidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID || '',
    webClientId: process.env.GOOGLE_WEB_CLIENT_ID || '',
  },
};

export default config;

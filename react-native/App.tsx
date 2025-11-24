import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation';
import { useThemeStore, useOnboardingStore } from './src/store';
import { TestBoolean } from './TestBoolean';
import './global.css';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { SplashScreen, OnboardingScreen, LoginScreen } from './src/screens';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import * as ExpoSplashScreen from 'expo-splash-screen';

ExpoSplashScreen.preventAutoHideAsync();

const USE_TEST_MODE = false;

export default function App() {
  const { theme } = useThemeStore();
  const { setColorScheme } = useColorScheme();
  const { hasSeenOnboarding, isAuthenticated } = useOnboardingStore();
  const [showSplash, setShowSplash] = useState(true);

  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      ExpoSplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    setColorScheme(theme);
  }, [theme]);

  if (!fontsLoaded) {
    return null;
  }

  if (USE_TEST_MODE) {
    return <TestBoolean />;
  }

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // Show onboarding if not seen yet
  if (!hasSeenOnboarding) {
    return (
      <SafeAreaProvider>
        <OnboardingScreen />
        <StatusBar style="dark" />
      </SafeAreaProvider>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <SafeAreaProvider>
        <LoginScreen />
        <StatusBar style="dark" />
      </SafeAreaProvider>
    );
  }

  // Show main app
  return (
    <SafeAreaProvider>
      <AppNavigator />
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </SafeAreaProvider>
  );
}

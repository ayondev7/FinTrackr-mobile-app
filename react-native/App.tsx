import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

















































































import { QueryClientProvider } from '@tanstack/react-query';
import { AppNavigator } from './src/navigation';
import { useThemeStore, useOnboardingStore } from './src/store';
import { queryClient } from './src/hooks';
import { TestBoolean } from './TestBoolean';
import './global.css';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { SplashScreen, OnboardingScreen, LoginScreen, BalanceSetupScreen } from './src/screens';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { ToastContainer } from './src/components/shared';

ExpoSplashScreen.preventAutoHideAsync();

const USE_TEST_MODE = false;

function AppContent() {
  const { theme } = useThemeStore();
  const { setColorScheme } = useColorScheme();
  const { hasSeenOnboarding, isAuthenticated, hasSetupBalance } = useOnboardingStore();
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

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (!hasSeenOnboarding) {
    return (
      <SafeAreaProvider>
        <OnboardingScreen />
        <ToastContainer />
        <StatusBar style="dark" />
      </SafeAreaProvider>
    );
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaProvider>
        <LoginScreen />
        <ToastContainer />
        <StatusBar style="dark" />
      </SafeAreaProvider>
    );
  }

  if (!hasSetupBalance) {
    return (
      <SafeAreaProvider>
        <BalanceSetupScreen />
        <ToastContainer />
        <StatusBar style="dark" />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <AppNavigator />
      <ToastContainer />
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

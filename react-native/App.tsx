import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation';
import { useThemeStore } from './src/store';
import { TestBoolean } from './TestBoolean';
import './global.css';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';

const USE_TEST_MODE = false;

export default function App() {
  const { theme } = useThemeStore();
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(theme);
  }, [theme]);

  if (USE_TEST_MODE) {
    return <TestBoolean />;
  }

  return (
    <SafeAreaProvider>
      <AppNavigator />
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </SafeAreaProvider>
  );
}

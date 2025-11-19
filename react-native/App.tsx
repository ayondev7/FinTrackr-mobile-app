import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation';
import { useThemeStore } from './src/store';
import { TestBoolean } from './TestBoolean';
import './global.css';

// Toggle this to test
const USE_TEST_MODE = false;

export default function App() {
  const { theme } = useThemeStore();

  if (USE_TEST_MODE) {
    return <TestBoolean />;
  }

  return (
    <>
      <AppNavigator />
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </>
  );
}

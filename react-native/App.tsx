import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation';
import { useThemeStore } from './src/store';
import './global.css';

export default function App() {
  const { theme } = useThemeStore();

  return (
    <>
      <AppNavigator />
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </>
  );
}

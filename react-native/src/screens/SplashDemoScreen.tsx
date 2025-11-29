import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { SplashScreen } from './SplashScreen';

export const SplashDemoScreen: React.FC = () => {
  const navigation = useNavigation();

  return <SplashScreen onFinish={() => navigation.goBack()} />;
};

import React from 'react';
import { View } from 'react-native';
import { useOnboardingStore } from '../store/onboardingStore';
import { AuthHeader, AuthInput, AuthButton, AuthDivider, AuthFooter } from '../components/auth';

export const LoginScreen: React.FC = () => {
  const { setIsAuthenticated } = useOnboardingStore();

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <View className="flex-1" style={{ backgroundColor: '#F8F5FF' }}>
      <View className="flex-1 justify-between px-8 pt-20 pb-10">
        <AuthHeader title="FinTrackr" subtitle="Welcome Back!" />

        <View className="flex-1 justify-center">
          <AuthInput placeholder="Email input (coming soon)" />
          <AuthInput placeholder="Password input (coming soon)" />

          <AuthButton title="Login" onPress={handleLogin} variant="primary" />

          <AuthDivider />

          <AuthButton title="Continue with Google" onPress={() => {}} variant="social" />
          <AuthButton title="Continue with Apple" onPress={() => {}} variant="social" />
        </View>

        <AuthFooter text="Don't have an account?" linkText="Sign Up" />
      </View>
    </View>
  );
};

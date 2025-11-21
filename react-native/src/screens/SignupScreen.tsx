import React from 'react';
import { View } from 'react-native';
import { useOnboardingStore } from '../store/onboardingStore';
import { AuthHeader, AuthInput, AuthButton, AuthDivider, AuthFooter } from '../components/auth';

export const SignupScreen: React.FC = () => {
  const { setIsAuthenticated } = useOnboardingStore();

  const handleSignup = () => {
    setIsAuthenticated(true);
  };

  return (
    <View className="flex-1" style={{ backgroundColor: '#F0F9FF' }}>
      <View className="flex-1 justify-between px-8 pt-16 pb-10">
        <AuthHeader title="FinTrackr" subtitle="Create Account" />

        <View className="flex-1 justify-center">
          <AuthInput placeholder="Full Name (coming soon)" />
          <AuthInput placeholder="Email input (coming soon)" />
          <AuthInput placeholder="Password input (coming soon)" />
          <AuthInput placeholder="Confirm Password (coming soon)" />

          <AuthButton title="Sign Up" onPress={handleSignup} variant="primary" />

          <AuthDivider />

          <AuthButton title="Continue with Google" onPress={() => {}} variant="social" />
          <AuthButton title="Continue with Apple" onPress={() => {}} variant="social" />
        </View>

        <AuthFooter text="Already have an account?" linkText="Login" />
      </View>
    </View>
  );
};

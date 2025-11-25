import React, { useMemo, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useOnboardingStore } from '../store/onboardingStore';
import { config } from '../config';
import { saveTokens } from '../utils/authStorage';

WebBrowser.maybeCompleteAuthSession();

export const LoginScreen: React.FC = () => {
  const { setIsAuthenticated } = useOnboardingStore();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [request, , promptAsync] = Google.useAuthRequest({
    clientId: config.google.expoClientId || undefined,
    iosClientId: config.google.iosClientId || undefined,
    androidClientId: config.google.androidClientId || undefined,
    webClientId: config.google.webClientId || undefined,
  });

  const isGoogleConfigured = useMemo(() => {
    return Boolean(
      config.google.expoClientId ||
      config.google.iosClientId ||
      config.google.androidClientId ||
      config.google.webClientId
    );
  }, []);

  const handleGoogleLogin = async () => {
    if (isAuthenticating) {
      return;
    }

    if (!isGoogleConfigured) {
      Alert.alert('Google auth unavailable', 'Set your Google client IDs in the .env file.');
      return;
    }

    if (!request) {
      Alert.alert('Google auth unavailable', 'Still preparing Google Sign-In. Please try again.');
      return;
    }

    try {
      setIsAuthenticating(true);
      const result = await promptAsync();

      if (result.type !== 'success' || !result.authentication?.accessToken) {
        throw new Error('Google authentication was cancelled.');
      }

      const googleProfileResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${result.authentication.accessToken}`,
        },
      });

      if (!googleProfileResponse.ok) {
        throw new Error('Unable to fetch Google profile.');
      }

      const profile = await googleProfileResponse.json();

      const backendResponse = await fetch(`${config.apiBaseUrl}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sub: profile.sub,
          email: profile.email,
          name: profile.name,
          given_name: profile.given_name,
          family_name: profile.family_name,
          picture: profile.picture,
        }),
      });

      const backendPayload = await backendResponse.json();

      if (!backendResponse.ok || !backendPayload.success) {
        throw new Error(backendPayload.error || backendPayload.message || 'Unable to authenticate with FinTrackr.');
      }

      const tokens = backendPayload.data;

      if (!tokens?.accessToken || !tokens?.refreshToken) {
        throw new Error('Missing tokens from FinTrackr response.');
      }

      await saveTokens(tokens.accessToken, tokens.refreshToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Google login error:', error);
      Alert.alert('Authentication failed', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 justify-between px-8 pt-16 pb-12">
        {/* Logo Section */}
        <View className="items-center mt-8">
          <Image
            source={require('../../assets/auth-logo.webp')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Content Section */}
        <View className="flex-1 justify-center px-4">
          <Text className="text-5xl font-extrabold text-gray-900 text-center mb-4">
            Welcome to{'\n'}
            <Text className="text-indigo-600">FinTrackr</Text>
          </Text>
          
          <Text className="text-base text-gray-500 text-center mb-2 leading-6">
            Your <Text className="font-bold text-gray-700">smart companion</Text> for
          </Text>
          
          <Text className="text-base text-gray-500 text-center mb-8 leading-6">
            <Text className="font-semibold text-gray-700">effortless</Text> money management
          </Text>

          <View className="mb-12">
            <View className="flex-row items-center mb-4">
              <View className="w-2 h-2 rounded-full bg-indigo-600 mr-3" />
              <Text className="text-gray-600 text-base">
                <Text className="font-bold text-gray-800">Track</Text> your expenses in real-time
              </Text>
            </View>
            
            <View className="flex-row items-center mb-4">
              <View className="w-2 h-2 rounded-full bg-indigo-600 mr-3" />
              <Text className="text-gray-600 text-base">
                <Text className="font-bold text-gray-800">Visualize</Text> your spending habits
              </Text>
            </View>
            
            <View className="flex-row items-center mb-4">
              <View className="w-2 h-2 rounded-full bg-indigo-600 mr-3" />
              <Text className="text-gray-600 text-base">
                <Text className="font-bold text-gray-800">Achieve</Text> your financial goals
              </Text>
            </View>
          </View>

          {/* Google Sign-in Button */}
          <TouchableOpacity
            onPress={handleGoogleLogin}
            style={[styles.googleButton, (!request || isAuthenticating) && styles.googleButtonDisabled]}
            activeOpacity={0.9}
            disabled={!request || isAuthenticating}
          >
            <View className="flex-row items-center justify-center">
              {isAuthenticating ? (
                <>
                  <ActivityIndicator color="#1F2937" style={styles.spinner} />
                  <Text style={styles.googleButtonText}>Signing in...</Text>
                </>
              ) : (
                <>
                  <View style={styles.googleIconContainer}>
                    <Ionicons name="logo-google" size={22} color="#4285F4" />
                  </View>
                  <Text style={styles.googleButtonText}>
                    Continue with Google
                  </Text>
                </>
              )}
            </View>
          </TouchableOpacity>

          <Text className="text-xs text-gray-400 text-center mt-6 px-8 leading-5">
            By continuing, you agree to our{' '}
            <Text className="text-indigo-600 font-semibold">Terms of Service</Text>
            {' '}and{' '}
            <Text className="text-indigo-600 font-semibold">Privacy Policy</Text>
          </Text>

          {/* Skip to Dashboard Button */}
          <TouchableOpacity
            onPress={() => setIsAuthenticated(true)}
            style={styles.skipButton}
            activeOpacity={0.7}
          >
            <Text style={styles.skipButtonText}>
              Skip for now
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Tagline */}
        <View className="items-center pb-4">
          <Text className="text-sm text-gray-400">
            Made with <Text className="text-red-500">♥</Text> for your financial freedom
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 140,
    height: 140,
    marginBottom: 8,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  googleButtonDisabled: {
    opacity: 0.7,
  },
  googleIconContainer: {
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 12,
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: 0.3,
  },
  spinner: {
    marginRight: 12,
  },
  skipButton: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginTop: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});

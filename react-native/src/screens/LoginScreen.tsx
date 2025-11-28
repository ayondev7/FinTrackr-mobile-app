import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  GoogleSignin,
  isSuccessResponse,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import axios from "axios";
import { useOnboardingStore } from "../store/onboardingStore";
import { useToastStore } from "../store/toastStore";
import { config } from "../config";
import { authRoutes } from "../routes";
import { saveTokens } from "../utils/authStorage";
import api from "../utils/api";

export const LoginScreen: React.FC = () => {
  const { setIsAuthenticated, setHasSetupBalance } = useOnboardingStore();
  const { showSuccess, showError, showInfo } = useToastStore();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    try {
      GoogleSignin.configure({
        webClientId: config.google.webClientId,
        offlineAccess: false,
      });
      setIsConfigured(true);
    } catch (error) {
      console.error("Failed to configure Google Sign-In:", error);
      showError("Configuration Error", "Failed to initialize Google Sign-In");
    }
  }, []);

  const handleGoogleLogin = async () => {
    if (isAuthenticating) {
      return;
    }

    if (!isConfigured) {
      showInfo("Please Wait", "Google Sign-In is initializing");
      return;
    }

    try {
      setIsAuthenticating(true);

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const signInResponse = await GoogleSignin.signIn();

      if (!isSuccessResponse(signInResponse)) {
        throw new Error("Google Sign-In was cancelled or failed");
      }

      const userData = signInResponse.data;
      console.log("Google Sign-In successful:", userData);

      const backendResponse = await api.post(authRoutes.googleLogin, {
        sub: userData.user.id,
        email: userData.user.email,
        name: userData.user.name,
        given_name: userData.user.givenName,
        family_name: userData.user.familyName,
        picture: userData.user.photo,
      });

      const backendPayload = backendResponse.data;

      if (!backendPayload.success) {
        throw new Error(
          backendPayload.error ||
            backendPayload.message ||
            "Authentication failed"
        );
      }

      const { accessToken, refreshToken, isNewUser } = backendPayload.data;

      if (!accessToken || !refreshToken) {
        throw new Error("Missing authentication tokens");
      }

      await saveTokens(accessToken, refreshToken);

      if (!isNewUser) {
        setHasSetupBalance(true);
      }

      showSuccess("Welcome!", `Signed in as ${userData.user.name}`);

      setIsAuthenticated(true);
    } catch (error) {
      console.error("Google login error:", error);

      if (isErrorWithCode(error)) {
        if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          showError(
            "Play Services Required",
            "Google Play Services is not available or outdated"
          );
        } else if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          showInfo("Sign-In Cancelled", "You cancelled the sign-in process");
        } else if (error.code === statusCodes.IN_PROGRESS) {
          showInfo("Sign-In In Progress", "Sign-in is already in progress");
        } else {
          showError("Authentication Failed", `Error: ${error.code}`);
        }
      } else if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Unable to connect to server";
        showError("Authentication Failed", errorMessage);
      } else {
        showError(
          "Authentication Failed",
          error instanceof Error ? error.message : "Please try again"
        );
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 justify-between px-8 pt-16 pb-12">
        {/* Content Section */}
        <View className="flex-1 justify-center px-4">
          <View className="items-center">
            <Image
              source={{
                uri: "https://ik.imagekit.io/swiftChat/fintrackr/auth-logo.webp",
              }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text className="text-base text-gray-500 text-center my-1 leading-6">
            Your{" "}
            <Text className="font-semibold text-gray-700">smart companion</Text> for
          </Text>

          <Text className="text-base text-gray-500 text-center mb-8 leading-6">
            <Text className="font-semibold text-gray-700">effortless</Text>{" "}
            money management
          </Text>

          <View className="mb-12 mt-2">
            <View className="flex-row items-center mb-4">
              <View className="w-2 h-2 rounded-full bg-indigo-600 mr-3" />
              <Text className="text-gray-600 text-base">
                <Text className="font-semibold text-gray-800">Track</Text> your
                expenses in real-time
              </Text>
            </View>

            <View className="flex-row items-center mb-4">
              <View className="w-2 h-2 rounded-full bg-indigo-600 mr-3" />
              <Text className="text-gray-600 text-base">
                <Text className="font-semibold text-gray-800">Visualize</Text> your
                spending habits
              </Text>
            </View>

            <View className="flex-row items-center mb-4">
              <View className="w-2 h-2 rounded-full bg-indigo-600 mr-3" />
              <Text className="text-gray-600 text-base">
                <Text className="font-semibold text-gray-800">Achieve</Text> your
                financial goals
              </Text>
            </View>
          </View>

          {/* Google Sign-in Button */}
          <TouchableOpacity
            onPress={handleGoogleLogin}
            style={[
              styles.googleButton,
              (!isConfigured || isAuthenticating) &&
                styles.googleButtonDisabled,
            ]}
            activeOpacity={0.9}
            disabled={!isConfigured || isAuthenticating}
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
                    <Ionicons name="logo-google" size={22} color="#4f46e5" />
                  </View>
                  <Text style={styles.googleButtonText}>
                    Continue with Google
                  </Text>
                </>
              )}
            </View>
          </TouchableOpacity>

          <Text className="text-xs text-gray-400 text-center mt-6 px-8 leading-5">
            By continuing, you agree to our{" "}
            <Text className="text-indigo-600 font-semibold">
              Terms of Service
            </Text>{" "}
            and{" "}
            <Text className="text-indigo-600 font-semibold">
              Privacy Policy
            </Text>
          </Text>
        </View>

        {/* Bottom Tagline */}
        <View className="items-center pb-4">
          <Text className="text-sm text-gray-400">
            Made with <Text className="text-indigo-600">♥</Text> for your financial
            freedom
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 220,
    height: 110,
  },
  googleButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  googleButtonDisabled: {
    opacity: 0.7,
  },
  googleIconContainer: {
    backgroundColor: "#F3F4F6",
    padding: 8,
    borderRadius: 12,
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1F2937",
    letterSpacing: 0.3,
  },
  spinner: {
    marginRight: 12,
  },
});

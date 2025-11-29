import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// This is a static, editable preview of the app's initial loading screen.
// It intentionally does NOT auto-navigate away so you can style it freely.
export const SplashPreviewScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <View className="items-center">
        <Image
         source={{
                uri: "https://ik.imagekit.io/swiftChat/fintrackr/auth-logo.webp",
              }}
          style={{ width: 230, height: 120}}
          resizeMode="contain"
        />
        <Text className="text-lg text-indigo-900 font-semibold" style={{ letterSpacing: 2 }}>
          Track • Analyze • Prosper
        </Text>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mt-8 bg-indigo-600 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Close Preview</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

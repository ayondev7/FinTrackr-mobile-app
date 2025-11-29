import React, { useEffect } from 'react';
import { View, Text, Animated, Image } from 'react-native';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 2000);
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Animated.View
        className="items-center"
        style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}
      >
        <Image
          source={{ uri: 'https://ik.imagekit.io/swiftChat/fintrackr/splash-icon.png' }}
          style={{ width: 230, height: 120, marginBottom: 18 }}
          resizeMode="contain"
        />

        <Text className="text-lg text-indigo-900 font-semibold mb-2" style={{ letterSpacing: 2 }}>
          Track • Analyze • Prosper
        </Text>
      </Animated.View>
    </View>
  );
};

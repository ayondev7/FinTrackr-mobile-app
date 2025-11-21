import React, { useEffect } from 'react';
import { View, Text, Animated } from 'react-native';

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
    <View className="flex-1 justify-center items-center" style={{ backgroundColor: '#F8F5FF' }}>
      <Animated.View
        className="items-center"
        style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}
      >
        <View 
          className="w-32 h-32 rounded-3xl bg-indigo-600 justify-center items-center mb-6"
          style={{
            shadowColor: '#6366F1',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          <Text className="text-6xl font-bold text-white">₹</Text>
        </View>
        <Text className="text-5xl font-bold text-gray-900 mb-2" style={{ letterSpacing: 1 }}>
          FinTrackr
        </Text>
        <Text className="text-lg text-gray-600 font-semibold" style={{ letterSpacing: 2 }}>
          Track • Analyze • Prosper
        </Text>
      </Animated.View>
    </View>
  );
};

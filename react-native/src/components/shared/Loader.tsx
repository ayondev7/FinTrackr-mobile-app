import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useThemeStore } from '../../store';
import { colors } from '../../constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface LoaderProps {
  size?: number;
  color?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 48, color }) => {
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  const strokeColor = color || themeColors.primary;

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedProps = useAnimatedProps(() => {
    const p = progress.value;
    const circumference = 2 * Math.PI * 7; // ~43.98
    
    // Interpolate dash length based on CSS keyframes
    // 0% -> 0.01
    // 50% -> 21.99
    // 100% -> 0.01
    const dashLength = interpolate(
      p,
      [0, 0.5, 1],
      [0.01, 21.99, 0.01]
    );
    
    const gapLength = circumference - dashLength;
    
    return {
      strokeDasharray: [dashLength, gapLength],
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    const p = progress.value;
    // Interpolate rotation based on CSS keyframes
    // 0% -> 0deg
    // 50% -> 450deg
    // 100% -> 1080deg
    const rotation = interpolate(
      p,
      [0, 0.5, 1],
      [0, 450, 1080]
    );
    
    return {
      transform: [
        { rotate: `${rotation}deg` }
      ]
    };
  });

  // Calculate stroke width to match approximately 2px at 48px size
  // 2px / 48px = x / 16px => x = 0.67
  const strokeWidth = 0.67;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View style={[{ width: size, height: size }, animatedStyle]}>
        <Svg 
          width={size} 
          height={size} 
          viewBox="0 0 16 16"
        >
          <AnimatedCircle
            cx="8"
            cy="8"
            r="7"
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            animatedProps={animatedProps}
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

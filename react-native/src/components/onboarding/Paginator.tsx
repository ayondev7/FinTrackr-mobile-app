import React from 'react';
import { View, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface PaginatorProps {
  data: any[];
  scrollX: Animated.Value;
}

export const Paginator: React.FC<PaginatorProps> = ({ data, scrollX }) => {
  return (
    <View className="flex-row justify-center items-center mb-8">
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 30, 10],
          extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={i}
            className="h-2 rounded bg-indigo-600 mx-1"
            style={{ width: dotWidth, opacity }}
          />
        );
      })}
    </View>
  );
};

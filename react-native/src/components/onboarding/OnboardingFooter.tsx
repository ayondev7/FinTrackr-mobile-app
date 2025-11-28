import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface OnboardingFooterProps {
  currentIndex: number;
  totalSlides: number;
  onNext: () => void;
}

export const OnboardingFooter: React.FC<OnboardingFooterProps> = ({
  currentIndex,
  totalSlides,
  onNext,
}) => {
  const isLastSlide = currentIndex === totalSlides - 1;

  return (
    <View className="items-center mt-4">
      <TouchableOpacity
        onPress={onNext}
        className="bg-indigo-600 py-4 rounded-full w-full items-center"
        style={{
          shadowColor: '#6366F1',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          elevation: 6,
        }}
      >
        <Text className="text-base text-white font-bold min-w-full text-center">
          {isLastSlide ? 'Get Started' : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

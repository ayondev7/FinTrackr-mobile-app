import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface OnboardingFooterProps {
  currentIndex: number;
  totalSlides: number;
  onSkip: () => void;
  onNext: () => void;
}

export const OnboardingFooter: React.FC<OnboardingFooterProps> = ({
  currentIndex,
  totalSlides,
  onSkip,
  onNext,
}) => {
  const isLastSlide = currentIndex === totalSlides - 1;

  return (
    <View className="flex-row justify-between items-center">
      <TouchableOpacity onPress={onSkip} className="py-4 px-6">
        <Text className="text-base text-gray-600 font-semibold">Skip</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onNext}
        className="bg-indigo-600 py-4 px-12 rounded-full"
        style={{
          shadowColor: '#6366F1',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          elevation: 6,
        }}
      >
        <Text className="text-base text-white font-bold">
          {isLastSlide ? 'Get Started' : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

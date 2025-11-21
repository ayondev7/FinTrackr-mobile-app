import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface OnboardingSlideProps {
  title: string;
  description: string;
  image: string;
  bgColor: string;
  icon: string;
}

export const OnboardingSlide: React.FC<OnboardingSlideProps> = ({
  title,
  description,
  image,
  bgColor,
  icon,
}) => {
  return (
    <View 
      className="justify-start items-center pt-16" 
      style={{ width, backgroundColor: bgColor }}
    >
      <View className="flex-1 w-full px-8 pt-10">
        <View className="mb-12">
          <Text className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {title}
          </Text>
          <Text className="text-base text-gray-600 leading-6">
            {description}
          </Text>
        </View>

        <View className="w-full items-center justify-center relative" style={{ height: width * 0.85 }}>
          <View 
            className="absolute -bottom-6 right-8 w-24 h-24 rounded-full bg-indigo-600 items-center justify-center z-10"
            style={{
              shadowColor: '#6366F1',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 15,
              elevation: 12,
            }}
          >
            <Text className="text-5xl">{icon}</Text>
          </View>
          <View
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 15 },
              shadowOpacity: 0.15,
              shadowRadius: 25,
              elevation: 10,
              borderRadius: 24,
            }}
          >
            <Image
              source={{ uri: image }}
              className="rounded-3xl"
              style={{
                width: width * 0.75,
                height: width * 0.75,
              }}
              resizeMode="cover"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

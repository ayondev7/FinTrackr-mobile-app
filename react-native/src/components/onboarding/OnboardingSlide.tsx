import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface OnboardingSlideProps {
  title: string;
  description: string;
  image: any;
  bgColor: string;
  children?: React.ReactNode;
}

export const OnboardingSlide: React.FC<OnboardingSlideProps> = ({
  title,
  description,
  image,
  bgColor,
  children,
}) => {
  return (
    <View 
      className="justify-start items-center pt-16 flex-1" 
      style={{ width, backgroundColor: bgColor }}
    >
      <View className="w-full px-8 pt-10">
        <View className="mb-8">
          <Text className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {title}
          </Text>
          <Text className="text-base text-gray-600 leading-6">
            {description}
          </Text>
        </View>

        <View className="w-full items-center justify-center relative mt-8">
          <View>
            <Image
              source={image}
              className="rounded-3xl"
              style={{
                width: width * 0.8,
                height: width * 0.8,
              }}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
      
      {children}
    </View>
  );
};

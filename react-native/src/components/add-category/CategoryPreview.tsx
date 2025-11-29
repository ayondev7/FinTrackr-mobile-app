import React from 'react';
import { View } from 'react-native';

interface CategoryPreviewProps {
  color: string;
  IconComponent: any;
}

export const CategoryPreview: React.FC<CategoryPreviewProps> = ({ color, IconComponent }) => {
  return (
    <View 
      className="w-20 h-20 rounded-2xl items-center justify-center mt-6 self-center mb-2"
      style={{ backgroundColor: `${color}20` }}
    >
      <IconComponent size={36} color={color} />
    </View>
  );
};

import React from 'react';
import { View, LucideIcon } from 'react-native';

interface CategoryPreviewProps {
  color: string;
  IconComponent: any;
}

export const CategoryPreview: React.FC<CategoryPreviewProps> = ({ color, IconComponent }) => {
  return (
    <View 
      className="w-20 h-20 rounded-2xl items-center justify-center self-center mb-4"
      style={{ backgroundColor: `${color}20` }}
    >
      <IconComponent size={40} color={color} />
    </View>
  );
};

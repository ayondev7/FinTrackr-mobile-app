import React from 'react';
import { ICON_OPTIONS } from '../../constants/categoryOptions';
import { Folder } from 'lucide-react-native';

interface CategoryIconProps {
  iconName: string;
  size?: number;
  color?: string;
}

export const CategoryIcon = ({ iconName, size = 20, color = '#6B7280' }: CategoryIconProps) => {
  const iconOption = ICON_OPTIONS.find((opt) => opt.name === iconName);
  
  if (!iconOption) {
    return <Folder size={size} color={color} />;
  }
  
  const IconComponent = iconOption.component;
  return <IconComponent size={size} color={color} />;
};

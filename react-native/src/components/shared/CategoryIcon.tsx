import React from 'react';
import { ICON_OPTIONS } from '../../constants/categoryOptions';
import { Folder } from 'lucide-react-native';

interface CategoryIconProps {
  iconName: string;
  size?: number;
  color?: string;
}

// Convert kebab-case or lowercase to match icon names
// e.g., "shopping-bag" -> "ShoppingBag", "shoppingbag" -> "ShoppingBag"
const normalizeIconName = (name: string): string => {
  if (!name) return '';
  
  // Handle kebab-case: "shopping-bag" -> "ShoppingBag"
  if (name.includes('-')) {
    return name
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join('');
  }
  
  // Handle already PascalCase or lowercase single word
  return name.charAt(0).toUpperCase() + name.slice(1);
};

export const CategoryIcon = ({ iconName, size = 20, color = '#6B7280' }: CategoryIconProps) => {
  const normalizedName = normalizeIconName(iconName);
  
  // Try exact match first
  let iconOption = ICON_OPTIONS.find((opt) => opt.name === iconName);
  
  // Try normalized name
  if (!iconOption) {
    iconOption = ICON_OPTIONS.find((opt) => opt.name === normalizedName);
  }
  
  // Try case-insensitive match
  if (!iconOption) {
    iconOption = ICON_OPTIONS.find(
      (opt) => opt.name.toLowerCase() === iconName.toLowerCase()
    );
  }
  
  // Try case-insensitive match with normalized name
  if (!iconOption) {
    iconOption = ICON_OPTIONS.find(
      (opt) => opt.name.toLowerCase() === normalizedName.toLowerCase()
    );
  }
  
  if (!iconOption) {
    console.warn(`Icon not found: "${iconName}" (normalized: "${normalizedName}")`);
    return <Folder size={size} color={color} />;
  }
  
  const IconComponent = iconOption.component;
  return <IconComponent size={size} color={color} />;
};

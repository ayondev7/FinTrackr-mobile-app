import React from 'react';
import { View, TouchableOpacity } from 'react-native';

interface IconOption {
  name: string;
  component: any;
}

interface IconPickerProps {
  icons: IconOption[];
  selectedIcon: string;
  onSelectIcon: (iconName: string) => void;
  selectedColor: string;
  isDark?: boolean;
}

export const IconPicker: React.FC<IconPickerProps> = ({
  icons,
  selectedIcon,
  onSelectIcon,
  selectedColor,
  isDark = false,
}) => {
  return (
    <View className="flex-row flex-wrap gap-3">
      {icons.map((icon) => {
        const Icon = icon.component;
        return (
          <TouchableOpacity
            key={icon.name}
            onPress={() => onSelectIcon(icon.name)}
            className="w-14 h-14 rounded-xl items-center justify-center"
            style={{ 
              backgroundColor: selectedIcon === icon.name 
                ? `${selectedColor}30` 
                : isDark ? '#334155' : '#F3F4F6',
              borderWidth: 2,
              borderColor: selectedIcon === icon.name ? selectedColor : 'transparent'
            }}
          >
            <Icon 
              size={24} 
              color={selectedIcon === icon.name ? selectedColor : isDark ? '#94A3B8' : '#6B7280'} 
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

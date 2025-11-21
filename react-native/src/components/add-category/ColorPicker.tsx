import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';

interface ColorPickerProps {
  colors: string[];
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  colors,
  selectedColor,
  onSelectColor,
}) => {
  return (
    <View className="flex-row flex-wrap gap-3">
      {colors.map((color) => (
        <TouchableOpacity
          key={color}
          onPress={() => onSelectColor(color)}
          className="w-14 h-14 rounded-xl items-center justify-center"
          style={{ 
            backgroundColor: color,
            opacity: selectedColor === color ? 1 : 0.5,
            transform: [{ scale: selectedColor === color ? 1.1 : 1 }]
          }}
        >
          {selectedColor === color && (
            <Check size={24} color="#FFFFFF" strokeWidth={3} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

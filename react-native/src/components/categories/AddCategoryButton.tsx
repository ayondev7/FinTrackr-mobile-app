import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useThemeStore } from '../../store';
import { colors } from '../../constants/theme';

interface AddCategoryButtonProps {
  onPress: () => void;
}

export const AddCategoryButton = ({ onPress }: AddCategoryButtonProps) => {
  const { theme } = useThemeStore();
  const themeColors = colors[theme];

  return (
    <TouchableOpacity
      className="rounded-2xl p-4 mb-6 flex-row items-center justify-center gap-2"
      style={{ backgroundColor: themeColors.info }}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Plus size={20} color="#FFF" />
      <Text className="text-white text-lg font-semibold">Create New Category</Text>
    </TouchableOpacity>
  );
};

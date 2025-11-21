import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Plus } from 'lucide-react-native';

interface AddCategoryButtonProps {
  onPress: () => void;
}

export const AddCategoryButton = ({ onPress }: AddCategoryButtonProps) => {
  return (
    <TouchableOpacity
      className="bg-indigo-600 dark:bg-indigo-500 rounded-2xl p-4 mb-6 flex-row items-center justify-center gap-2"
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Plus size={20} color="#FFF" />
      <Text className="text-white text-lg font-semibold">Add New Category</Text>
    </TouchableOpacity>
  );
};

import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Plus } from 'lucide-react-native';

interface AddBudgetButtonProps {
  onPress: () => void;
  primaryColor: string;
}

export const AddBudgetButton = ({ onPress, primaryColor }: AddBudgetButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="flex-row items-center justify-center gap-2 p-4 rounded-2xl mb-6"
      style={{ backgroundColor: primaryColor }}
    >
      <Plus size={20} color="#FFFFFF" />
      <Text className="text-white font-semibold text-base">Create New Budget</Text>
    </TouchableOpacity>
  );
};

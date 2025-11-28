import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Target, Plus } from 'lucide-react-native';
import { Card } from '../shared/Card';

interface EmptyBudgetStateProps {
  onCreatePress: () => void;
  primaryColor: string;
}

export const EmptyBudgetState = ({ onCreatePress, primaryColor }: EmptyBudgetStateProps) => {
  return (
    <Card className="p-8 items-center">
      <View
        className="w-20 h-20 rounded-full items-center justify-center mb-4"
        style={{ backgroundColor: `${primaryColor}20` }}
      >
        <Target size={40} color={primaryColor} />
      </View>
      <Text className="text-gray-900 dark:text-white text-xl font-bold mb-2 text-center">
        No Budgets Yet
      </Text>
      <Text className="text-gray-500 dark:text-gray-400 text-center mb-6 px-4">
        Create your first budget to start tracking your spending and stay on top of your finances.
      </Text>
      <TouchableOpacity
        onPress={onCreatePress}
        activeOpacity={0.8}
        className="flex-row items-center gap-2 px-6 py-3 rounded-xl"
        style={{ backgroundColor: primaryColor }}
      >
        <Plus size={20} color="#FFFFFF" />
        <Text className="text-white font-semibold">Create First Budget</Text>
      </TouchableOpacity>
    </Card>
  );
};

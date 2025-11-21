import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { X, Check } from 'lucide-react-native';

interface ScreenHeaderProps {
  title: string;
  onClose: () => void;
  onSave: () => void;
  canSave: boolean;
  saveColor?: string;
  isDark?: boolean;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  onClose,
  onSave,
  canSave,
  saveColor = '#6366F1',
  isDark = false,
}) => {
  return (
    <View className="bg-white dark:bg-slate-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-row items-center justify-between">
      <TouchableOpacity onPress={onClose} className="p-2">
        <X size={24} color={isDark ? '#F1F5F9' : '#1F2937'} />
      </TouchableOpacity>
      <Text className="text-xl font-bold text-gray-900 dark:text-white">
        {title}
      </Text>
      <TouchableOpacity onPress={onSave} disabled={!canSave} className="p-2">
        <Check 
          size={24} 
          color={canSave ? saveColor : isDark ? '#475569' : '#9CA3AF'} 
        />
      </TouchableOpacity>
    </View>
  );
};

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card } from '../Card';
import { Folder, Briefcase, Pin } from 'lucide-react-native';
import { useCategoryStore } from '../../store';

interface Category {
  id: string;
  name: string;
  type: string;
  color: string;
  isPinned?: boolean;
}

interface CategoryItemProps {
  category: Category;
  iconType?: 'folder' | 'briefcase';
  onPress?: () => void;
}

export const CategoryItem = ({ category, iconType = 'folder', onPress }: CategoryItemProps) => {
  const Icon = iconType === 'folder' ? Folder : Briefcase;
  const { togglePin } = useCategoryStore();
  
  return (
    <Card className="mb-3 p-4">
      <TouchableOpacity 
        className="flex-row items-center justify-between"
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View className="flex-row items-center gap-3 flex-1">
          <View
            className="w-12 h-12 rounded-xl items-center justify-center"
            style={{ backgroundColor: `${category.color}20` }}
          >
            <Icon size={24} color={category.color} />
          </View>
          <View className="flex-1">
            <Text className="text-gray-900 dark:text-white font-semibold text-base mb-1">
              {category.name}
            </Text>
            <View
              className="px-2 py-1 rounded-full self-start"
              style={{ backgroundColor: `${category.color}20` }}
            >
              <Text className="text-xs font-medium" style={{ color: category.color }}>
                {category.type.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            togglePin(category.id);
          }}
          className="p-2"
          activeOpacity={0.7}
        >
          <Pin 
            size={20} 
            color={category.isPinned ? category.color : '#9CA3AF'}
            fill={category.isPinned ? category.color : 'transparent'}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Card>
  );
};

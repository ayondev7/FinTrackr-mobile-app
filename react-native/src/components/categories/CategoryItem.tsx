import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '../Card';
import { Folder, Briefcase } from 'lucide-react-native';

interface Category {
  id: string;
  name: string;
  type: string;
  color: string;
}

interface CategoryItemProps {
  category: Category;
  iconType?: 'folder' | 'briefcase';
}

export const CategoryItem = ({ category, iconType = 'folder' }: CategoryItemProps) => {
  const Icon = iconType === 'folder' ? Folder : Briefcase;
  
  return (
    <Card className="mb-3 p-4">
      <View className="flex-row items-center justify-between">
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
        <View
          className="w-6 h-6 rounded-full"
          style={{ backgroundColor: category.color }}
        />
      </View>
    </Card>
  );
};

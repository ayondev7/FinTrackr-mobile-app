import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CategoryItem } from './CategoryItem';

interface Category {
  id: string;
  name: string;
  type: string;
  color: string;
  isPinned?: boolean;
}

interface CategoryListProps {
  title: string;
  categories: Category[];
  iconType?: 'folder' | 'briefcase';
}

export const CategoryList = ({ title, categories, iconType = 'folder' }: CategoryListProps) => {
  const navigation = useNavigation();

  return (
    <>
      <Text className="text-gray-900 dark:text-white text-xl font-bold mb-4">
        {title}
      </Text>
      <View className="mb-6">
        {categories.map((category) => (
          <CategoryItem 
            key={category.id} 
            category={category} 
            iconType={iconType}
            onPress={() => {
              (navigation as any).navigate('CategoryDetail', {
                categoryId: category.id,
              });
            }}
          />
        ))}
      </View>
    </>
  );
};

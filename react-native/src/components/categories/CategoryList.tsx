import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CategoryItem } from './CategoryItem';
import { CategoryWithCount } from '../../hooks';

interface CategoryListProps {
  title: string;
  categories: CategoryWithCount[];
  refetch: () => void;
}

export const CategoryList = ({ title, categories, refetch }: CategoryListProps) => {
  const navigation = useNavigation();

  if (categories.length === 0) {
    return (
      <>
        <Text className="text-gray-900 dark:text-white text-xl font-bold mb-4">
          {title}
        </Text>
        <View className="mb-6 bg-white dark:bg-slate-800 rounded-2xl p-6 items-center">
          <Text className="text-gray-500 dark:text-gray-400 text-center">
            No categories yet
          </Text>
        </View>
      </>
    );
  }

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
            refetch={refetch}
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

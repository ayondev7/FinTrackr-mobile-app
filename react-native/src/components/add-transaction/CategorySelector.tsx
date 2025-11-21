import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Category } from '../../types';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  textColor: string;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  textColor,
}) => {
  return (
    <View>
      <Text className="text-gray-700 dark:text-gray-300 font-medium mb-3">
        Category *
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row -mx-1"
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => onSelectCategory(category.id)}
            className="mx-1"
          >
            <View
              className={`px-4 py-3 rounded-xl ${
                selectedCategory === category.id
                  ? 'border-2'
                  : 'border border-gray-200 dark:border-gray-700'
              }`}
              style={{
                backgroundColor: `${category.color}${
                  selectedCategory === category.id ? '30' : '10'
                }`,
                borderColor:
                  selectedCategory === category.id
                    ? category.color
                    : 'transparent',
              }}
            >
              <Text
                className="font-medium"
                style={{
                  color: selectedCategory === category.id ? category.color : textColor,
                }}
              >
                {category.name}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

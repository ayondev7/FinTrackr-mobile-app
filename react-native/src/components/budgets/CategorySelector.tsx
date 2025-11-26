import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Check } from 'lucide-react-native';
import { Category } from '../../types';
import { CategoryIcon } from '../shared/CategoryIcon';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelect: (categoryId: string) => void;
  disabledCategoryIds?: string[];
}

export const CategorySelector = ({
  categories,
  selectedCategoryId,
  onSelect,
  disabledCategoryIds = [],
}: CategorySelectorProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 4 }}
    >
      <View className="flex-row gap-3">
        {categories.map((category) => {
          const isSelected = selectedCategoryId === category.id;
          const isDisabled = disabledCategoryIds.includes(category.id);

          return (
            <TouchableOpacity
              key={category.id}
              onPress={() => !isDisabled && onSelect(category.id)}
              activeOpacity={isDisabled ? 1 : 0.7}
              className={`items-center p-3 rounded-xl min-w-[80px] ${
                isDisabled ? 'opacity-40' : ''
              }`}
              style={{
                backgroundColor: isSelected ? `${category.color}20` : 'transparent',
                borderWidth: 2,
                borderColor: isSelected ? category.color : 'transparent',
              }}
            >
              <View
                className="w-12 h-12 rounded-xl items-center justify-center mb-2 relative"
                style={{ backgroundColor: `${category.color}20` }}
              >
                <CategoryIcon iconName={category.icon} size={24} color={category.color} />
                {isSelected && (
                  <View
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full items-center justify-center"
                    style={{ backgroundColor: category.color }}
                  >
                    <Check size={12} color="#FFFFFF" />
                  </View>
                )}
              </View>
              <Text
                className="text-xs font-medium text-center"
                style={{ color: isSelected ? category.color : '#6B7280' }}
                numberOfLines={1}
              >
                {category.name}
              </Text>
              {isDisabled && (
                <Text className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Has budget
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

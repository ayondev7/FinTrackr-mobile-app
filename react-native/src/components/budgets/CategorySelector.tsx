import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Check, Plus } from 'lucide-react-native';
import { Category } from '../../types';
import { CategoryIcon } from '../shared/CategoryIcon';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelect: (categoryId: string) => void;
  disabledCategoryIds?: string[];
  disabled?: boolean;
}

export const CategorySelector = ({
  categories,
  selectedCategoryId,
  onSelect,
  disabledCategoryIds = [],
  disabled = false,
}: CategorySelectorProps) => {
  const navigation = useNavigation();

  const handleCreateCategory = () => {
    navigation.navigate('AddCategory' as never);
  };

  if (categories.length === 0) {
    return (
      <View className="items-center py-6">
        <Text className="text-gray-500 dark:text-gray-400 text-center mb-4">
          No expense categories available. Create one to set a budget.
        </Text>
        <TouchableOpacity
          onPress={handleCreateCategory}
          className="flex-row items-center gap-2 bg-indigo-600 px-5 py-3 rounded-xl"
        >
          <Plus size={20} color="#FFFFFF" />
          <Text className="text-white font-semibold">Create New Category</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 4, opacity: disabled ? 0.6 : 1 }}
    >
      <View className="flex-row gap-3">
        {categories.map((category) => {
          const isSelected = selectedCategoryId === category.id;
          const isDisabled = disabledCategoryIds.includes(category.id) || disabled;

          return (
            <TouchableOpacity
              key={category.id}
              onPress={() => !isDisabled && onSelect(category.id)}
              activeOpacity={isDisabled ? 1 : 0.7}
              className={`items-center p-3 rounded-xl min-w-[80px] ${
                disabledCategoryIds.includes(category.id) ? 'opacity-40' : ''
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
              {disabledCategoryIds.includes(category.id) && (
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

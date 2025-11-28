import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Plus } from 'lucide-react-native';
import { Category } from '../../types';
import { CategoryIcon } from '../shared/CategoryIcon';
import { useThemeStore } from '../../store';
import { colors } from '../../constants/theme';

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
  const navigation = useNavigation();
  const { theme } = useThemeStore();
  const themeColors = colors[theme];

  const handleCreateCategory = () => {
    navigation.navigate('AddCategory' as never);
  };

  return (
    <View>
      <Text className="text-gray-700 dark:text-gray-300 font-medium mb-3">
        Category *
      </Text>
      {categories.length === 0 ? (
        <View className="items-center py-6">
          <Text className="text-gray-500 dark:text-gray-400 text-center mb-4">
            No categories available. Create one to get started.
          </Text>
          <TouchableOpacity
            onPress={handleCreateCategory}
            className="flex-row items-center gap-2 px-5 py-3 rounded-xl"
            style={{ backgroundColor: themeColors.info }}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text className="text-white font-semibold">Create New Category</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row -mx-1"
        >
          {categories.map((category) => {
            const isSelected = selectedCategory === category.id;
            return (
              <TouchableOpacity
                key={category.id}
                onPress={() => onSelectCategory(category.id)}
                className="mx-1"
              >
                <View
                  className={`px-4 py-3 rounded-xl flex-row items-center gap-2 ${
                    isSelected
                      ? 'border-2'
                      : 'border border-gray-200 dark:border-gray-700'
                  }`}
                  style={{
                    backgroundColor: `${category.color}${isSelected ? '30' : '10'}`,
                    borderColor: isSelected ? category.color : 'transparent',
                  }}
                >
                  <CategoryIcon 
                    iconName={category.icon} 
                    size={16} 
                    color={isSelected ? category.color : textColor} 
                  />
                  <Text
                    className="font-medium"
                    style={{
                      color: isSelected ? category.color : textColor,
                    }}
                  >
                    {category.name}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

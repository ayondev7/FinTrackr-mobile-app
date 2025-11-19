import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from '../components';
import { useCategoryStore, useThemeStore } from '../store';
import { colors } from '../constants/theme';
import { Folder, Briefcase, Plus } from 'lucide-react-native';

export const CategoriesScreen = () => {
  const { categories } = useCategoryStore();
  const { theme } = useThemeStore();
  const themeColors = colors[theme];

  const expenseCategories = categories.filter(
    (cat) => cat.type === 'expense' || cat.type === 'both'
  );
  const revenueCategories = categories.filter(
    (cat) => cat.type === 'revenue' || cat.type === 'both'
  );

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-slate-900">
      <View className="p-6">
        <Text className="text-gray-900 dark:text-white text-3xl font-bold mb-6">
          Categories
        </Text>

        <TouchableOpacity
          className="bg-indigo-600 dark:bg-indigo-500 rounded-2xl p-4 mb-6 flex-row items-center justify-center gap-2"
          activeOpacity={0.7}
        >
          <Plus size={20} color="#FFF" />
          <Text className="text-white text-lg font-semibold">Add New Category</Text>
        </TouchableOpacity>

        <Text className="text-gray-900 dark:text-white text-xl font-bold mb-4">
          Expense Categories
        </Text>
        <View className="mb-6">
          {expenseCategories.map((category) => (
            <Card key={category.id} className="mb-3 p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3 flex-1">
                  <View
                    className="w-12 h-12 rounded-xl items-center justify-center"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <Folder size={24} color={category.color} />
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
          ))}
        </View>

        <Text className="text-gray-900 dark:text-white text-xl font-bold mb-4">
          Revenue Categories
        </Text>
        <View>
          {revenueCategories.map((category) => (
            <Card key={category.id} className="mb-3 p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3 flex-1">
                  <View
                    className="w-12 h-12 rounded-xl items-center justify-center"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <Briefcase size={24} color={category.color} />
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
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

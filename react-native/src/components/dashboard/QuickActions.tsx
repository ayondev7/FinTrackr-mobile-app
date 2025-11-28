import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Plus, Target, Tag } from 'lucide-react-native';
import { Card } from '../shared/Card';
import { CategoryIcon } from '../shared/CategoryIcon';
import { useCategories } from '../../hooks';
import { useThemeStore } from '../../store';
import { colors } from '../../constants/theme';

export const QuickActions = () => {
  const navigation = useNavigation();
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  
  const { data: categoriesData } = useCategories();
  const pinnedCategories = categoriesData?.data?.filter((cat) => cat.isPinned) || [];

  return (
    <>
      <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Quick Access
      </Text>

      {/* Combined horizontal row: quick actions, pinned categories, and Pin at the end */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-6 pb-4"
        contentContainerStyle={{ gap: 12 }}
      >
        {/* Budgets */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Budgets' as never)}
          activeOpacity={0.7}
        >
          <Card className="p-4" style={{ width: 110 }}>
            <View
              className="w-10 h-10 rounded-xl items-center justify-center mb-2"
              style={{ backgroundColor: `${themeColors.warning}20` }}
            >
              <Target size={20} color={themeColors.warning} />
            </View>
            <Text
              className="font-semibold text-sm mb-1"
              numberOfLines={1}
              style={{ color: themeColors.warning }}
            >
              Budgets
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-xs">
              Manage limits
            </Text>
          </Card>
        </TouchableOpacity>

        {/* Categories */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Categories' as never)}
          activeOpacity={0.7}
        >
          <Card className="p-4" style={{ width: 110 }}>
            <View
              className="w-10 h-10 rounded-xl items-center justify-center mb-2"
              style={{ backgroundColor: `${themeColors.info}20` }}
            >
              <Tag size={20} color={themeColors.info} />
            </View>
            <Text
              className="font-semibold text-sm mb-1"
              numberOfLines={1}
              style={{ color: themeColors.info }}
            >
              Categories
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-xs">
              Manage all
            </Text>
          </Card>
        </TouchableOpacity>

        {/* Pinned Categories */}
        {pinnedCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => {
              (navigation as any).navigate('CategoryDetail', {
                categoryId: category.id,
              });
            }}
            activeOpacity={0.7}
          >
            <Card className="p-4" style={{ width: 110 }}>
              <View
                className="w-10 h-10 rounded-xl items-center justify-center mb-2"
                style={{ backgroundColor: `${category.color}20` }}
              >
                <CategoryIcon iconName={category.icon} size={20} color={category.color} />
              </View>
              <Text
                className="font-semibold text-sm mb-1"
                numberOfLines={1}
                style={{ color: category.color }}
              >
                {category.name}
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-xs">
                {category._count?.transactions || 0} transactions
              </Text>
            </Card>
          </TouchableOpacity>
        ))}

        {/* Add Pin Button - placed last */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Categories' as never)}
          activeOpacity={0.7}
        >
          <Card className="p-4" style={{ width: 110 }}>
            <View
              className="w-10 h-10 rounded-xl items-center justify-center mb-2"
              style={{ backgroundColor: `${themeColors.info}20` }}
            >
              <Plus size={20} color={themeColors.info} />
            </View>
            <Text
              className="font-semibold text-sm mb-1"
              numberOfLines={1}
              style={{ color: themeColors.info }}
            >
              Pin
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-xs">
              Add favorite
            </Text>
          </Card>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

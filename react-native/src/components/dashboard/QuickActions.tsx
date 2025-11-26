import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Plus, Target, Grid3X3 } from 'lucide-react-native';
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
      
      {/* Quick Action Buttons Row */}
      <View className="flex-row gap-3 mb-4">
        {/* Budgets */}
        <TouchableOpacity
          className="flex-1"
          onPress={() => navigation.navigate('Budgets' as never)}
          activeOpacity={0.7}
        >
          <Card className="p-4">
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
          className="flex-1"
          onPress={() => navigation.navigate('Categories' as never)}
          activeOpacity={0.7}
        >
          <Card className="p-4">
            <View
              className="w-10 h-10 rounded-xl items-center justify-center mb-2"
              style={{ backgroundColor: `${themeColors.info}20` }}
            >
              <Grid3X3 size={20} color={themeColors.info} />
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
      </View>

      {/* Pinned Categories Horizontal Scroll */}
      {pinnedCategories.length > 0 && (
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
            Pinned Categories
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
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
                <Card className="p-4" style={{ width: 100 }}>
                  <View
                    className="w-10 h-10 rounded-xl items-center justify-center mb-2 self-center"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <CategoryIcon 
                      iconName={category.icon} 
                      size={20} 
                      color={category.color} 
                    />
                  </View>
                  <Text
                    className="font-semibold text-sm text-center"
                    numberOfLines={1}
                    style={{ color: category.color }}
                  >
                    {category.name}
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-xs text-center">
                    {category._count?.transactions || 0} txns
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
            
            {/* Add Pin Button */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Categories' as never)}
              activeOpacity={0.7}
            >
              <Card className="p-4 items-center justify-center" style={{ width: 100 }}>
                <View
                  className="w-10 h-10 rounded-xl items-center justify-center mb-2"
                  style={{ backgroundColor: `${themeColors.primary}20` }}
                >
                  <Plus size={20} color={themeColors.primary} />
                </View>
                <Text
                  className="font-semibold text-sm text-center"
                  numberOfLines={1}
                  style={{ color: themeColors.primary }}
                >
                  Add Pin
                </Text>
                <Text className="text-gray-500 dark:text-gray-400 text-xs text-center">
                  Pin more
                </Text>
              </Card>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* Show "Add Pin" if no pinned categories */}
      {pinnedCategories.length === 0 && (
        <View className="mb-6">
          <TouchableOpacity
            onPress={() => navigation.navigate('Categories' as never)}
            activeOpacity={0.7}
          >
            <Card className="p-4 flex-row items-center gap-3">
              <View
                className="w-10 h-10 rounded-xl items-center justify-center"
                style={{ backgroundColor: `${themeColors.primary}20` }}
              >
                <Plus size={20} color={themeColors.primary} />
              </View>
              <View className="flex-1">
                <Text
                  className="font-semibold text-sm"
                  style={{ color: themeColors.primary }}
                >
                  Pin Your Favorite Categories
                </Text>
                <Text className="text-gray-500 dark:text-gray-400 text-xs">
                  Quick access to frequently used categories
                </Text>
              </View>
            </Card>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

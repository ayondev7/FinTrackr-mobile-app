import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Folder, Plus, Target, Grid3X3 } from 'lucide-react-native';
import { Card } from '../shared/Card';
import { useCategoryStore, useThemeStore } from '../../store';
import { colors } from '../../constants/theme';

export const QuickActions = () => {
  const navigation = useNavigation();
  const { getPinnedCategories } = useCategoryStore();
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  const pinnedCategories = getPinnedCategories();

  return (
    <>
      <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Quick Access
      </Text>
      
      {/* Quick Action Buttons Row */}
      <View className="flex-row gap-3 mb-6">
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

        {/* Pinned Category or Add Pin */}
        {pinnedCategories.length === 0 ? (
          <TouchableOpacity
            className="flex-1"
            onPress={() => navigation.navigate('Categories' as never)}
            activeOpacity={0.7}
          >
            <Card className="p-4">
              <View
                className="w-10 h-10 rounded-xl items-center justify-center mb-2"
                style={{ backgroundColor: `${themeColors.primary}20` }}
              >
                <Plus size={20} color={themeColors.primary} />
              </View>
              <Text
                className="font-semibold text-sm mb-1"
                numberOfLines={1}
                style={{ color: themeColors.primary }}
              >
                Pin
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-xs">
                Add favorite
              </Text>
            </Card>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="flex-1"
            onPress={() => {
              (navigation as any).navigate('CategoryDetail', {
                categoryId: pinnedCategories[0].id,
              });
            }}
            activeOpacity={0.7}
          >
            <Card className="p-4">
              <View
                className="w-10 h-10 rounded-xl items-center justify-center mb-2"
                style={{ backgroundColor: `${pinnedCategories[0].color}20` }}
              >
                <Folder size={20} color={pinnedCategories[0].color} />
              </View>
              <Text
                className="font-semibold text-sm mb-1"
                numberOfLines={1}
                style={{ color: pinnedCategories[0].color }}
              >
                {pinnedCategories[0].name}
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-xs">
                View Details
              </Text>
            </Card>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

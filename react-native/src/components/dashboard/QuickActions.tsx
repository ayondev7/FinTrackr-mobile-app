import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Folder, Plus } from 'lucide-react-native';
import { Card } from '../Card';
import { useCategoryStore } from '../../store';

export const QuickActions = () => {
  const navigation = useNavigation();
  const { getPinnedCategories } = useCategoryStore();
  const pinnedCategories = getPinnedCategories();

  if (pinnedCategories.length === 0) {
    return (
      <>
        <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Quick Access
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Categories' as never)}
          activeOpacity={0.7}
          className="mb-6"
        >
          <Card className="p-6 items-center">
            <Plus size={32} color="#6B7280" className="mb-2" />
            <Text className="text-gray-600 dark:text-gray-400 text-sm text-center">
              Pin your favorite categories for quick access
            </Text>
          </Card>
        </TouchableOpacity>
      </>
    );
  }

  return (
    <>
      <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Quick Access
      </Text>
      <View className="flex-row gap-3 mb-6">
        {pinnedCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            className="flex-1"
            onPress={() => {
              (navigation as any).navigate('CategoryDetail', {
                categoryId: category.id,
              });
            }}
            activeOpacity={0.7}
          >
            <Card className="p-4">
              <View
                className="w-10 h-10 rounded-xl items-center justify-center mb-2"
                style={{ backgroundColor: `${category.color}20` }}
              >
                <Folder size={20} color={category.color} />
              </View>
              <Text
                className="font-semibold text-sm mb-1"
                numberOfLines={1}
                style={{ color: category.color }}
              >
                {category.name}
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-xs">
                View Details
              </Text>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
};

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card } from '../shared/Card';
import { Loader } from '../shared/Loader';
import { CategoryIcon } from '../shared/CategoryIcon';
import { Pin } from 'lucide-react-native';
import { useUpdateCategory, CategoryWithCount } from '../../hooks';
import { useToastStore } from '../../store';

interface CategoryItemProps {
  category: CategoryWithCount;
  onPress?: () => void;
  refetch: () => void;
}

export const CategoryItem = ({ category, onPress, refetch }: CategoryItemProps) => {
  const updateCategory = useUpdateCategory();
  const { showSuccess, showError } = useToastStore();
  
  const handleTogglePin = async () => {
    if (updateCategory.isPending) return;
    
    const newPinnedState = !category.isPinned;
    
    try {
      await updateCategory.mutateAsync({
        id: category.id,
        data: { isPinned: newPinnedState },
      });
      refetch();
      showSuccess(
        newPinnedState ? 'Category Pinned' : 'Category Unpinned',
        `"${category.name}" has been ${newPinnedState ? 'pinned to' : 'removed from'} quick actions.`
      );
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update category. Please try again.';
      showError('Error', errorMessage);
    }
  };

  return (
    <Card className="mb-3 p-4">
      <TouchableOpacity 
        className="flex-row items-center justify-between"
        onPress={onPress}
        activeOpacity={0.7}
        disabled={updateCategory.isPending}
      >
        <View className="flex-row items-center gap-3 flex-1">
          <View
            className="w-12 h-12 rounded-xl items-center justify-center"
            style={{ backgroundColor: `${category.color}20` }}
          >
            <CategoryIcon iconName={category.icon} size={24} color={category.color} />
          </View>
          <View className="flex-1">
            <Text className="text-gray-900 dark:text-white font-semibold text-base mb-1">
              {category.name}
            </Text>
            <View className="flex-row items-center gap-2">
              <View
                className="px-2 py-1 rounded-full"
                style={{ backgroundColor: `${category.color}20` }}
              >
                <Text className="text-xs font-medium" style={{ color: category.color }}>
                  {category.type}
                </Text>
              </View>
              <Text className="text-gray-500 dark:text-gray-400 text-xs">
                {category._count?.transactions || 0} transactions
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            handleTogglePin();
          }}
          className="p-2"
          activeOpacity={0.7}
          disabled={updateCategory.isPending}
        >
          {updateCategory.isPending ? (
            <Loader size={20} color={category.color} />
          ) : (
            <Pin 
              size={20} 
              color={category.isPinned ? category.color : '#9CA3AF'}
              fill={category.isPinned ? category.color : 'transparent'}
            />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Card>
  );
};

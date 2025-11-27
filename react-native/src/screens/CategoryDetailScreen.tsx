import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Modal, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useUserStore, useThemeStore } from '../store';
import { useCategory, useCategoryTransactions, useUpdateCategory, useDeleteCategory } from '../hooks';
import { ArrowLeft, Pencil, Trash2, X } from 'lucide-react-native';
import { CategoryOverview, TimeBreakdown, RecentTransactionsList } from '../components/category-detail';
import { colors } from '../constants/theme';

type CategoryDetailRouteParams = {
  CategoryDetail: {
    categoryId: string;
  };
};

export const CategoryDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<CategoryDetailRouteParams, 'CategoryDetail'>>();
  const insets = useSafeAreaInsets();
  const { user } = useUserStore();
  const { theme } = useThemeStore();
  const themeColors = colors[theme];

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [editedName, setEditedName] = useState('');

  const categoryId = route.params?.categoryId;
  const { data: categoryData, isLoading: categoryLoading } = useCategory(categoryId || '');
  const { data: transactionsData, isLoading: transactionsLoading } = useCategoryTransactions(categoryId || '');
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const category = categoryData?.data;
  const categoryTransactions = transactionsData?.data?.transactions || [];

  const isLoading = categoryLoading || transactionsLoading;

  const handleEditPress = () => {
    if (category) {
      setEditedName(category.name);
      setIsEditModalVisible(true);
    }
  };

  const handleSaveEdit = () => {
    if (editedName.trim() && categoryId) {
      updateCategoryMutation.mutate(
        { id: categoryId, data: { name: editedName.trim() } },
        {
          onSuccess: () => {
            setIsEditModalVisible(false);
          },
        }
      );
    }
  };

  const handleDeletePress = () => {
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (categoryId) {
      deleteCategoryMutation.mutate(categoryId, {
        onSuccess: () => {
          setIsDeleteModalVisible(false);
          navigation.goBack();
        },
      });
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50 dark:bg-slate-900 items-center justify-center">
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  if (!category) {
    return (
      <View className="flex-1 bg-gray-50 dark:bg-slate-900 items-center justify-center">
        <Text className="text-gray-500 dark:text-gray-400 text-lg">
          Category not found
        </Text>
      </View>
    );
  }

  const totalSpent = categoryTransactions.reduce(
    (sum, txn) => sum + txn.amount,
    0
  );

  return (
    <>
      <ScrollView className="flex-1 bg-gray-50 dark:bg-slate-900">
        <View className="p-6" style={{ paddingTop: insets.top + 12 }}>
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity
              className="flex-row items-center gap-2"
              onPress={() => navigation.goBack()}
            >
              <ArrowLeft size={24} color="#6B7280" />
              <Text className="text-gray-600 dark:text-gray-400 text-base">
                Back
              </Text>
            </TouchableOpacity>

            <View className="flex-row items-center gap-3">
              <TouchableOpacity
                onPress={handleEditPress}
                className="w-10 h-10 rounded-xl items-center justify-center bg-gray-100 dark:bg-slate-800"
              >
                <Pencil size={20} color={themeColors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDeletePress}
                className="w-10 h-10 rounded-xl items-center justify-center bg-red-50 dark:bg-red-900/20"
              >
                <Trash2 size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>

          <CategoryOverview
            categoryName={category.name}
            categoryIcon={category.icon}
            categoryColor={category.color}
            categoryType={category.type}
            totalSpent={totalSpent}
            transactionCount={categoryTransactions.length}
            avgPerTransaction={categoryTransactions.length > 0 ? totalSpent / categoryTransactions.length : 0}
            currency={user?.currency || 'USD'}
          />

          <TimeBreakdown
            transactions={categoryTransactions}
            categoryColor={category.color}
            currency={user?.currency || 'USD'}
          />

          <RecentTransactionsList
            transactions={categoryTransactions}
            categoryColor={category.color}
            currency={user?.currency || 'USD'}
          />
        </View>
      </ScrollView>

      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center px-6">
          <View className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-sm">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-gray-900 dark:text-white text-xl font-bold">
                Edit Category
              </Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text className="text-gray-600 dark:text-gray-400 text-sm mb-2">
              Category Name
            </Text>
            <TextInput
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Enter category name"
              placeholderTextColor="#9CA3AF"
              className="bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white px-4 py-3 rounded-xl text-base mb-6"
            />

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setIsEditModalVisible(false)}
                className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-slate-700"
              >
                <Text className="text-gray-600 dark:text-gray-400 text-center font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveEdit}
                disabled={updateCategoryMutation.isPending}
                className="flex-1 py-3 rounded-xl"
                style={{ backgroundColor: category.color }}
              >
                <Text className="text-white text-center font-semibold">
                  {updateCategoryMutation.isPending ? 'Saving...' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isDeleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center px-6">
          <View className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-sm">
            <View className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 items-center justify-center self-center mb-4">
              <Trash2 size={32} color="#EF4444" />
            </View>

            <Text className="text-gray-900 dark:text-white text-xl font-bold text-center mb-2">
              Delete Category?
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-center mb-2">
              Are you sure you want to delete "{category.name}"?
            </Text>
            <Text className="text-red-500 text-center text-sm mb-6">
              This will permanently delete {categoryTransactions.length} transaction{categoryTransactions.length !== 1 ? 's' : ''} and all related budgets.
            </Text>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setIsDeleteModalVisible(false)}
                className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-slate-700"
              >
                <Text className="text-gray-600 dark:text-gray-400 text-center font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmDelete}
                disabled={deleteCategoryMutation.isPending}
                className="flex-1 py-3 rounded-xl bg-red-500"
              >
                <Text className="text-white text-center font-semibold">
                  {deleteCategoryMutation.isPending ? 'Deleting...' : 'Delete'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

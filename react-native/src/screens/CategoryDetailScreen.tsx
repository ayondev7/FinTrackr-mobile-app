import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useUserStore, useThemeStore, useToastStore } from '../store';
import { useCategory, useCategoryTransactions, useUpdateCategory, useDeleteCategory } from '../hooks';
import { ArrowLeft, Pencil, Trash2, X } from 'lucide-react-native';
import { CategoryOverview, TimeBreakdown, RecentTransactionsList } from '../components/category-detail';
import { Loader } from '../components/shared';
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
  const { showSuccess, showError } = useToastStore();
  const themeColors = colors[theme];

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editNameError, setEditNameError] = useState('');

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
      setEditNameError('');
      setIsEditModalVisible(true);
    }
  };

  const validateEditName = (): boolean => {
    if (!editedName.trim()) {
      setEditNameError('Category name is required');
      return false;
    }
    if (editedName.trim().length > 50) {
      setEditNameError('Category name must be less than 50 characters');
      return false;
    }
    setEditNameError('');
    return true;
  };

  const handleSaveEdit = async () => {
    if (!validateEditName() || !categoryId || updateCategoryMutation.isPending) return;

    try {
      await updateCategoryMutation.mutateAsync({
        id: categoryId,
        data: { name: editedName.trim() },
      });
      setIsEditModalVisible(false);
      showSuccess('Category Updated', `Category name changed to "${editedName.trim()}".`);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update category. Please try again.';
      showError('Error', errorMessage);
    }
  };

  const handleDeletePress = () => {
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryId || deleteCategoryMutation.isPending) return;

    const categoryName = category?.name || 'Category';

    try {
      await deleteCategoryMutation.mutateAsync(categoryId);
      setIsDeleteModalVisible(false);
      showSuccess('Category Deleted', `"${categoryName}" and all related data have been removed.`);
      navigation.goBack();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete category. Please try again.';
      showError('Error', errorMessage);
    }
  };

  const handleCloseEditModal = () => {
    if (!updateCategoryMutation.isPending) {
      setIsEditModalVisible(false);
    }
  };

  const handleCloseDeleteModal = () => {
    if (!deleteCategoryMutation.isPending) {
      setIsDeleteModalVisible(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50 dark:bg-slate-900 items-center justify-center">
        <Loader size={64} />
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
                <Pencil size={20} color={themeColors.info} />
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
        onRequestClose={handleCloseEditModal}
      >
        <View className="flex-1 bg-black/50 items-center justify-center px-6">
          <View className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-sm">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-gray-900 dark:text-white text-xl font-bold">
                Edit Category
              </Text>
              <TouchableOpacity 
                onPress={handleCloseEditModal}
                disabled={updateCategoryMutation.isPending}
              >
                <X size={24} color={updateCategoryMutation.isPending ? '#9CA3AF' : '#6B7280'} />
              </TouchableOpacity>
            </View>

            <Text className="text-gray-600 dark:text-gray-400 text-sm mb-2">
              Category Name
            </Text>
            <TextInput
              value={editedName}
              onChangeText={(text) => {
                setEditedName(text);
                if (editNameError) setEditNameError('');
              }}
              placeholder="Enter category name"
              placeholderTextColor="#9CA3AF"
              editable={!updateCategoryMutation.isPending}
              className="bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white px-4 py-3 rounded-xl text-base mb-2"
              style={{ opacity: updateCategoryMutation.isPending ? 0.6 : 1 }}
            />
            {editNameError && (
              <Text className="text-red-500 text-xs mb-4 ml-1">
                {editNameError}
              </Text>
            )}
            {!editNameError && <View className="mb-4" />}

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={handleCloseEditModal}
                disabled={updateCategoryMutation.isPending}
                className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-slate-700"
                style={{ opacity: updateCategoryMutation.isPending ? 0.6 : 1 }}
              >
                <Text className="text-gray-600 dark:text-gray-400 text-center font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveEdit}
                disabled={updateCategoryMutation.isPending || !editedName.trim()}
                className="flex-1 py-3 rounded-xl items-center justify-center"
                style={{ 
                  backgroundColor: category.color,
                  opacity: updateCategoryMutation.isPending || !editedName.trim() ? 0.6 : 1
                }}
              >
                {updateCategoryMutation.isPending ? (
                  <Loader size={20} color="#FFFFFF" />
                ) : (
                  <Text className="text-white text-center font-semibold">
                    Save
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isDeleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseDeleteModal}
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
                onPress={handleCloseDeleteModal}
                disabled={deleteCategoryMutation.isPending}
                className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-slate-700"
                style={{ opacity: deleteCategoryMutation.isPending ? 0.6 : 1 }}
              >
                <Text className="text-gray-600 dark:text-gray-400 text-center font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmDelete}
                disabled={deleteCategoryMutation.isPending}
                className="flex-1 py-3 rounded-xl bg-red-500 items-center justify-center"
                style={{ opacity: deleteCategoryMutation.isPending ? 0.8 : 1 }}
              >
                {deleteCategoryMutation.isPending ? (
                  <Loader size={20} color="#FFFFFF" />
                ) : (
                  <Text className="text-white text-center font-semibold">
                    Delete
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

import React from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useCategories } from '../hooks';
import { AddCategoryButton, CategoryList } from '../components/categories';
import { RefreshableScrollView, Loader } from '../components/shared';

export const CategoriesScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { data: categoriesData, isLoading, refetch } = useCategories();

  const categories = categoriesData?.data || [];

  const expenseCategories = categories.filter(
    (cat) => cat.type === 'EXPENSE'
  );
  const revenueCategories = categories.filter(
    (cat) => cat.type === 'REVENUE'
  );

  if (isLoading) {
    return (
      <View 
        className="flex-1 bg-gray-50 dark:bg-slate-900 justify-center items-center"
        style={{ paddingTop: insets.top }}
      >
        <Loader size={64} />
      </View>
    );
  }

  return (
    <RefreshableScrollView 
      className="flex-1 bg-gray-50 dark:bg-slate-900"
      onRefresh={async () => { await refetch(); }}
    >
      <View className="p-6" style={{ paddingTop: insets.top + 24 }}>
        <Text className="text-gray-900 dark:text-white text-3xl font-bold mb-6">
          Categories
        </Text>

        <AddCategoryButton onPress={() => navigation.navigate('AddCategory' as never)} />

        <CategoryList 
          title="Expense Categories" 
          categories={expenseCategories}
          refetch={refetch}
        />

        <CategoryList 
          title="Revenue Categories" 
          categories={revenueCategories}
          refetch={refetch}
        />
      </View>
    </RefreshableScrollView>
  );
};

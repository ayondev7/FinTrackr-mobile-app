import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useCategoryStore } from '../store';
import { AddCategoryButton, CategoryList } from '../components/categories';
import { RefreshableScrollView } from '../components/shared';

export const CategoriesScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { categories } = useCategoryStore();

  const expenseCategories = categories.filter(
    (cat) => cat.type === 'expense' || cat.type === 'both'
  );
  const revenueCategories = categories.filter(
    (cat) => cat.type === 'revenue' || cat.type === 'both'
  );

  const handleRefresh = async () => {
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <RefreshableScrollView 
      className="flex-1 bg-gray-50 dark:bg-slate-900"
      onRefresh={handleRefresh}
    >
      <View className="p-6" style={{ paddingTop: insets.top + 24 }}>
        <Text className="text-gray-900 dark:text-white text-3xl font-bold mb-6">
          Categories
        </Text>

        <AddCategoryButton onPress={() => navigation.navigate('AddCategory' as never)} />

        <CategoryList 
          title="Expense Categories" 
          categories={expenseCategories} 
          iconType="folder" 
        />

        <CategoryList 
          title="Revenue Categories" 
          categories={revenueCategories} 
          iconType="briefcase" 
        />
      </View>
    </RefreshableScrollView>
  );
};

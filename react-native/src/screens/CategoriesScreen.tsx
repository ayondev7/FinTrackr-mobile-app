import React from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Tag } from 'lucide-react-native';
import { useCategories } from '../hooks';
import { AddCategoryButton, CategoryList } from '../components/categories';
import { RefreshableScrollView, Loader } from '../components/shared';
import { useThemeStore } from '../store';
import { colors } from '../constants/theme';

export const CategoriesScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  const isDark = theme === 'dark';
  const { data: categoriesData, isLoading, refetch } = useCategories();

  const categories = categoriesData?.data || [];

  const expenseCategories = categories.filter(
    (cat) => (cat.type || '').toLowerCase() === 'expense'
  );
  const revenueCategories = categories.filter(
    (cat) => (cat.type || '').toLowerCase() === 'revenue'
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
      contentContainerStyle={{ paddingLeft: insets.left, paddingRight: insets.right }}
    >
      <View className="p-6" style={{ paddingTop: insets.top + 24 }}>
        <View className="flex-row items-center gap-3 mb-6">
          <Text className="text-gray-900 dark:text-white text-3xl font-bold">
            Categories
          </Text>
          <Tag size={28} color={themeColors.info} />
        </View>

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

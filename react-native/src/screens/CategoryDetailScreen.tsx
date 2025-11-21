import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTransactionStore, useCategoryStore, useUserStore } from '../store';
import { ArrowLeft } from 'lucide-react-native';
import { CategoryOverview, BreakdownByType, RecentTransactionsList } from '../components/category-detail';

type CategoryDetailRouteParams = {
  CategoryDetail: {
    categoryId: string;
  };
};

export const CategoryDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<CategoryDetailRouteParams, 'CategoryDetail'>>();
  const insets = useSafeAreaInsets();
  const { transactions } = useTransactionStore();
  const { categories } = useCategoryStore();
  const { user } = useUserStore();

  const categoryId = route.params?.categoryId;
  const category = categories.find((cat) => cat.id === categoryId);

  if (!category) {
    return (
      <View className="flex-1 bg-gray-50 dark:bg-slate-900 items-center justify-center">
        <Text className="text-gray-500 dark:text-gray-400 text-lg">
          Category not found
        </Text>
      </View>
    );
  }

  const categoryTransactions = transactions.filter(
    (txn) => txn.categoryId === category.id
  );

  const totalSpent = categoryTransactions.reduce(
    (sum, txn) => sum + txn.amount,
    0
  );

  const subCategoryBreakdown = categoryTransactions.reduce((acc: any[], txn) => {
    const existing = acc.find((item) => item.description === txn.description);
    if (existing) {
      existing.amount += txn.amount;
      existing.count += 1;
    } else {
      acc.push({
        description: txn.description || 'Other',
        amount: txn.amount,
        count: 1,
      });
    }
    return acc;
  }, []);

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-slate-900">
      <View className="p-6" style={{ paddingTop: insets.top + 12 }}>
        <TouchableOpacity
          className="flex-row items-center gap-2 mb-4"
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color="#6B7280" />
          <Text className="text-gray-600 dark:text-gray-400 text-base">
            Back
          </Text>
        </TouchableOpacity>

        <CategoryOverview
          categoryName={category.name}
          categoryColor={category.color}
          totalSpent={totalSpent}
          transactionCount={categoryTransactions.length}
          avgPerTransaction={totalSpent / categoryTransactions.length || 0}
          currency={user.currency}
        />

        <BreakdownByType
          subCategories={subCategoryBreakdown}
          totalSpent={totalSpent}
          categoryColor={category.color}
          currency={user.currency}
        />

        <RecentTransactionsList
          transactions={categoryTransactions}
          categoryColor={category.color}
          currency={user.currency}
        />
      </View>
    </ScrollView>
  );
};

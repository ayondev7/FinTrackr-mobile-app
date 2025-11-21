import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTransactionStore, useCategoryStore, useUserStore } from '../store';
import { HeartPulse } from 'lucide-react-native';
import { HealthcareSummary, SubCategoryBreakdown, RecentExpenses } from '../components/healthcare';

export const HealthcareScreen = () => {
  const insets = useSafeAreaInsets();
  const { transactions } = useTransactionStore();
  const { categories } = useCategoryStore();
  const { user } = useUserStore();

  const healthcareCategory = categories.find((cat) => cat.isHealthcare);
  const healthcareTransactions = transactions.filter(
    (txn) => txn.categoryId === healthcareCategory?.id
  );

  const totalSpent = healthcareTransactions.reduce(
    (sum, txn) => sum + txn.amount,
    0
  );

  const subCategoryBreakdown = healthcareTransactions.reduce((acc: any[], txn) => {
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
      <View className="p-6" style={{ paddingTop: insets.top + 24 }}>
        <View className="flex-row items-center gap-3 mb-2">
          <Text className="text-gray-900 dark:text-white text-3xl font-bold">
            Healthcare
          </Text>
          <HeartPulse size={28} color="#EF4444" />
        </View>
        <Text className="text-gray-500 dark:text-gray-400 text-base mb-6">
          Track medical expenses
        </Text>

        <HealthcareSummary
          totalSpent={totalSpent}
          transactionCount={healthcareTransactions.length}
          avgPerVisit={totalSpent / healthcareTransactions.length || 0}
          currency={user.currency}
        />

        <SubCategoryBreakdown
          subCategories={subCategoryBreakdown}
          totalSpent={totalSpent}
          currency={user.currency}
        />

        <RecentExpenses
          transactions={healthcareTransactions}
          currency={user.currency}
        />
      </View>
    </ScrollView>
  );
};

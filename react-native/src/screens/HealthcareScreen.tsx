import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Card } from '../components';
import { useTransactionStore, useCategoryStore, useUserStore } from '../store';
import { formatCurrency } from '../utils/helpers';

export const HealthcareScreen = () => {
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
      <View className="p-6">
        <Text className="text-gray-900 dark:text-white text-3xl font-bold mb-2">
          Healthcare 🏥
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 text-base mb-6">
          Track medical expenses
        </Text>

        <Card className="mb-6 p-6" variant="elevated">
          <Text className="text-gray-600 dark:text-gray-400 text-sm mb-2">
            Total Healthcare Spending
          </Text>
          <Text className="text-teal-500 text-4xl font-bold mb-4">
            {formatCurrency(totalSpent, user.currency)}
          </Text>
          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="text-gray-500 dark:text-gray-400 text-xs mb-1">
                Transactions
              </Text>
              <Text className="text-gray-900 dark:text-white font-semibold">
                {healthcareTransactions.length}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-500 dark:text-gray-400 text-xs mb-1">
                Avg. Per Visit
              </Text>
              <Text className="text-gray-900 dark:text-white font-semibold">
                {formatCurrency(totalSpent / healthcareTransactions.length || 0, user.currency)}
              </Text>
            </View>
          </View>
        </Card>

        <Text className="text-gray-900 dark:text-white text-xl font-bold mb-4">
          Breakdown by Type
        </Text>
        <View className="mb-6">
          {subCategoryBreakdown.map((item, index) => (
            <Card key={index} className="mb-3 p-4">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-gray-900 dark:text-white font-semibold text-base">
                  {item.description}
                </Text>
                <Text className="text-teal-500 font-bold text-lg">
                  {formatCurrency(item.amount, user.currency)}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-500 dark:text-gray-400 text-sm">
                  {item.count} transaction{item.count > 1 ? 's' : ''}
                </Text>
                <Text className="text-gray-500 dark:text-gray-400 text-sm">
                  {((item.amount / totalSpent) * 100).toFixed(1)}% of total
                </Text>
              </View>
            </Card>
          ))}
        </View>

        <Text className="text-gray-900 dark:text-white text-xl font-bold mb-4">
          Recent Healthcare Expenses
        </Text>
        <View>
          {healthcareTransactions.slice(0, 10).map((transaction) => (
            <Card key={transaction.id} className="mb-3 p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-gray-900 dark:text-white font-semibold mb-1">
                    {transaction.name || 'Healthcare Expense'}
                  </Text>
                  {transaction.description && (
                    <Text className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                      {transaction.description}
                    </Text>
                  )}
                  <Text className="text-gray-400 dark:text-gray-500 text-xs">
                    {new Date(transaction.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
                <Text className="text-red-500 font-bold text-lg">
                  {formatCurrency(transaction.amount, user.currency)}
                </Text>
              </View>
            </Card>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

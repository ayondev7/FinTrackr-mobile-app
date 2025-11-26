import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { PiggyBank, Filter } from 'lucide-react-native';
import { useThemeStore, useBudgetStore, useCategoryStore, useUserStore } from '../store';
import { colors } from '../constants/theme';
import { Folder } from 'lucide-react-native';
import {
  BudgetSummaryCard,
  BudgetItem,
  AddBudgetButton,
  BudgetAlertBanner,
  EmptyBudgetState,
} from '../components/budgets';

type FilterType = 'all' | 'on-track' | 'near-limit' | 'over-budget';

export const BudgetsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme } = useThemeStore();
  const { budgets } = useBudgetStore();
  const { categories } = useCategoryStore();
  const { user } = useUserStore();
  const themeColors = colors[theme];
  const isDark = theme === 'dark';

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const getCategoryById = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId);
  };

  const getBudgetStatus = (budget: typeof budgets[0]) => {
    const percentage = (budget.spent / budget.limit) * 100;
    if (budget.spent > budget.limit) return 'over-budget';
    if (percentage >= budget.alertThreshold) return 'near-limit';
    return 'on-track';
  };

  const filteredBudgets = budgets.filter((budget) => {
    if (activeFilter === 'all') return true;
    return getBudgetStatus(budget) === activeFilter;
  });

  const handleNavigateToAddBudget = () => {
    navigation.navigate('AddBudget' as never);
  };

  const FILTERS: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'on-track', label: 'On Track' },
    { value: 'near-limit', label: 'Near Limit' },
    { value: 'over-budget', label: 'Over Budget' },
  ];

  return (
    <ScrollView
      className="flex-1 bg-gray-50 dark:bg-slate-900"
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <View className="p-6" style={{ paddingTop: insets.top + 24 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center gap-3">
            <Text className="text-gray-900 dark:text-white text-3xl font-bold">
              Budgets
            </Text>
            <PiggyBank size={28} color={isDark ? '#FFF' : '#111827'} />
          </View>
        </View>

        {budgets.length === 0 ? (
          <EmptyBudgetState
            onCreatePress={handleNavigateToAddBudget}
            primaryColor={themeColors.primary}
          />
        ) : (
          <>
            {/* Alert Banner */}
            <BudgetAlertBanner
              budgets={budgets}
              onPress={() => setActiveFilter('over-budget')}
            />

            {/* Summary Card */}
            <BudgetSummaryCard
              budgets={budgets}
              currency={user.currency}
              primaryColor={themeColors.primary}
            />

            {/* Add Budget Button */}
            <AddBudgetButton
              onPress={handleNavigateToAddBudget}
              primaryColor={themeColors.primary}
            />

            {/* Filters */}
            <View className="mb-4">
              <View className="flex-row items-center gap-2 mb-3">
                <Filter size={18} color={isDark ? '#9CA3AF' : '#6B7280'} />
                <Text className="text-gray-600 dark:text-gray-400 font-medium">
                  Filter Budgets
                </Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
              >
                {FILTERS.map((filter) => {
                  const isActive = activeFilter === filter.value;
                  return (
                    <TouchableOpacity
                      key={filter.value}
                      onPress={() => setActiveFilter(filter.value)}
                      activeOpacity={0.7}
                      className={`px-4 py-2 rounded-full ${
                        isActive ? '' : 'bg-gray-100 dark:bg-slate-800'
                      }`}
                      style={isActive ? { backgroundColor: themeColors.primary } : undefined}
                    >
                      <Text
                        className={`font-medium ${
                          isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {filter.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Budget List */}
            <View className="mt-2">
              <Text className="text-gray-900 dark:text-white text-xl font-bold mb-4">
                {activeFilter === 'all'
                  ? 'All Budgets'
                  : `${FILTERS.find((f) => f.value === activeFilter)?.label} Budgets`}
                {' '}
                <Text className="text-gray-500 dark:text-gray-400 text-base font-normal">
                  ({filteredBudgets.length})
                </Text>
              </Text>

              {filteredBudgets.length === 0 ? (
                <View className="bg-white dark:bg-slate-800 rounded-2xl p-6 items-center">
                  <Text className="text-gray-500 dark:text-gray-400 text-center">
                    No budgets match this filter
                  </Text>
                </View>
              ) : (
                filteredBudgets.map((budget) => {
                  const category = getCategoryById(budget.categoryId);
                  return (
                    <BudgetItem
                      key={budget.id}
                      budget={budget}
                      categoryColor={category?.color || themeColors.primary}
                      categoryIcon={
                        <Folder size={24} color={category?.color || themeColors.primary} />
                      }
                      currency={user.currency}
                      onPress={() => {
                        // TODO: Navigate to budget detail or edit
                        console.log('Budget pressed:', budget.id);
                      }}
                    />
                  );
                })
              )}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

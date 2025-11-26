import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronRight, PiggyBank, AlertTriangle, TrendingUp } from 'lucide-react-native';
import { Card } from '../shared/Card';
import { BudgetProgressBar } from '../budgets/BudgetProgressBar';
import { useBudgetStore, useCategoryStore } from '../../store';

interface BudgetOverviewProps {
  currency: string;
  primaryColor: string;
}

export const BudgetOverview = ({ currency, primaryColor }: BudgetOverviewProps) => {
  const navigation = useNavigation();
  const { budgets, getExceededBudgets } = useBudgetStore();
  const { categories } = useCategoryStore();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryById = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId);
  };

  // Get budgets that need attention (near limit or over)
  const alertBudgets = budgets.filter((budget) => {
    const percentage = (budget.spent / budget.limit) * 100;
    return percentage >= budget.alertThreshold || budget.spent > budget.limit;
  });

  // Sort by percentage (highest first)
  const sortedBudgets = [...budgets].sort((a, b) => {
    const pctA = (a.spent / a.limit) * 100;
    const pctB = (b.spent / b.limit) * 100;
    return pctB - pctA;
  });

  // Take top 3 for preview
  const previewBudgets = sortedBudgets.slice(0, 3);

  if (budgets.length === 0) {
    return (
      <>
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold text-gray-900 dark:text-white">
            Budgets
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Budgets' as never)}
          activeOpacity={0.7}
        >
          <Card className="p-5 items-center mb-6">
            <View
              className="w-14 h-14 rounded-full items-center justify-center mb-3"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <PiggyBank size={28} color={primaryColor} />
            </View>
            <Text className="text-gray-900 dark:text-white font-semibold text-base mb-1">
              Set Up Your Budgets
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-sm text-center">
              Create budgets to track your spending
            </Text>
          </Card>
        </TouchableOpacity>
      </>
    );
  }

  return (
    <>
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-bold text-gray-900 dark:text-white">
            Budgets
          </Text>
          {alertBudgets.length > 0 && (
            <View className="bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full">
              <Text className="text-red-600 dark:text-red-400 text-xs font-semibold">
                {alertBudgets.length} alert{alertBudgets.length > 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Budgets' as never)}
          className="flex-row items-center gap-1"
        >
          <Text style={{ color: primaryColor }} className="font-medium">
            See All
          </Text>
          <ChevronRight size={16} color={primaryColor} />
        </TouchableOpacity>
      </View>

      {/* Alert Banner if needed */}
      {alertBudgets.length > 0 && (
        <TouchableOpacity
          onPress={() => navigation.navigate('Budgets' as never)}
          activeOpacity={0.8}
          className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 mb-3 flex-row items-center gap-3"
        >
          <AlertTriangle size={18} color="#EF4444" />
          <Text className="text-red-700 dark:text-red-400 text-sm flex-1">
            {alertBudgets.length} budget{alertBudgets.length > 1 ? 's' : ''} need{alertBudgets.length === 1 ? 's' : ''} your attention
          </Text>
          <ChevronRight size={16} color="#EF4444" />
        </TouchableOpacity>
      )}

      <Card className="mb-6 p-4">
        {previewBudgets.map((budget, index) => {
          const category = getCategoryById(budget.categoryId);
          const percentage = (budget.spent / budget.limit) * 100;
          const isOverBudget = budget.spent > budget.limit;
          const isNearLimit = percentage >= budget.alertThreshold && !isOverBudget;

          return (
            <View
              key={budget.id}
              className={`${index !== previewBudgets.length - 1 ? 'mb-4 pb-4 border-b border-gray-100 dark:border-slate-700' : ''}`}
            >
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center gap-2 flex-1">
                  <View
                    className="w-8 h-8 rounded-lg items-center justify-center"
                    style={{ backgroundColor: `${category?.color || primaryColor}20` }}
                  >
                    {isOverBudget ? (
                      <AlertTriangle size={14} color="#EF4444" />
                    ) : isNearLimit ? (
                      <TrendingUp size={14} color="#F59E0B" />
                    ) : (
                      <PiggyBank size={14} color={category?.color || primaryColor} />
                    )}
                  </View>
                  <Text
                    className="font-medium text-gray-900 dark:text-white flex-1"
                    numberOfLines={1}
                  >
                    {budget.categoryName}
                  </Text>
                </View>
                <Text className="text-gray-500 dark:text-gray-400 text-sm">
                  {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                </Text>
              </View>
              <BudgetProgressBar
                spent={budget.spent}
                limit={budget.limit}
                color={category?.color || primaryColor}
                showLabels={false}
                height={6}
              />
            </View>
          );
        })}

        {budgets.length > 3 && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Budgets' as never)}
            className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-700"
          >
            <Text style={{ color: primaryColor }} className="text-center font-medium">
              +{budgets.length - 3} more budget{budgets.length - 3 > 1 ? 's' : ''}
            </Text>
          </TouchableOpacity>
        )}
      </Card>
    </>
  );
};

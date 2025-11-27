import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronRight, PiggyBank, AlertTriangle } from 'lucide-react-native';
import { Card } from '../shared/Card';
import { CategoryIcon } from '../shared/CategoryIcon';
import { BudgetProgressBar } from '../budgets/BudgetProgressBar';
import { useBudgets } from '../../hooks';
import { Loader } from '../shared/Loader';
import { getCurrencySymbol } from '../../utils/helpers';

interface BudgetOverviewProps {
  currency: string;
  primaryColor: string;
}

export const BudgetOverview = ({ currency, primaryColor }: BudgetOverviewProps) => {
  const navigation = useNavigation();
  const { data: budgetsData, isLoading } = useBudgets();

  const budgets = budgetsData?.data || [];

  const formatCurrency = (amount: number) => {
    const symbol = getCurrencySymbol(currency);
    return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  // Get budgets that need attention (near limit or over)
  const alertBudgets = budgets.filter((budget) => budget.needsAlert || budget.isOverBudget);

  // Sort by percentage (highest first)
  const sortedBudgets = [...budgets].sort((a, b) => b.percentage - a.percentage);

  // Take top 3 for preview
  const previewBudgets = sortedBudgets.slice(0, 3);

  if (isLoading) {
    return (
      <>
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold text-gray-900 dark:text-white">
            Budgets
          </Text>
        </View>
        <Card className="mb-6 p-5 items-center">
          <Loader size={32} />
        </Card>
      </>
    );
  }

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
          const category = budget.category;
          const categoryColor = category?.color || primaryColor;

          return (
            <View
              key={budget.id}
              className={`${index !== previewBudgets.length - 1 ? 'mb-4 pb-4 border-b border-gray-100 dark:border-slate-700' : ''}`}
            >
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center gap-2 flex-1">
                  <View
                    className="w-8 h-8 rounded-lg items-center justify-center"
                    style={{ backgroundColor: `${categoryColor}20` }}
                  >
                    <CategoryIcon 
                      iconName={category?.icon || 'piggy-bank'} 
                      size={14} 
                      color={categoryColor} 
                    />
                  </View>
                  <Text
                    className="font-medium text-gray-900 dark:text-white flex-1"
                    numberOfLines={1}
                  >
                    {category?.name || 'Unknown Category'}
                  </Text>
                </View>
                <Text className="text-gray-500 dark:text-gray-400 text-sm">
                  {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                </Text>
              </View>
              <BudgetProgressBar
                spent={budget.spent}
                limit={budget.limit}
                color={categoryColor}
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

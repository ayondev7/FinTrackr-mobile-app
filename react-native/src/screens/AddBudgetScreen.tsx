import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { X, Check, DollarSign, Calendar, AlertCircle } from 'lucide-react-native';
import { useThemeStore, useUserStore } from '../store';
import { useCategories, useBudgets, useCreateBudget } from '../hooks';
import { colors } from '../constants/theme';
import { Card } from '../components';
import { CategoryIcon } from '../components/shared/CategoryIcon';
import { PeriodSelector, CategorySelector } from '../components/budgets';

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';

export const AddBudgetScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme } = useThemeStore();
  const { user } = useUserStore();
  const themeColors = colors[theme];
  const isDark = theme === 'dark';

  const { data: categoriesData } = useCategories();
  const { data: budgetsData } = useBudgets();
  const createBudget = useCreateBudget();

  const categories = categoriesData?.data || [];
  const budgets = budgetsData?.data || [];

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [limitAmount, setLimitAmount] = useState('');
  const [period, setPeriod] = useState<Period>('monthly');
  const [alertThreshold, setAlertThreshold] = useState('80');

  const expenseCategories = categories.filter((cat) => (cat.type || '').toLowerCase() === 'expense');
  
  const categoriesWithBudget = useMemo(() => {
    return budgets
      .filter((b) => b.period === period)
      .map((b) => b.categoryId);
  }, [budgets, period]);

  const selectedCategory = selectedCategoryId
    ? categories.find((c) => c.id === selectedCategoryId)
    : null;

  const canSave = selectedCategoryId && parseFloat(limitAmount) > 0 && !createBudget.isPending;

  const getDateRange = (selectedPeriod: Period): { startDate: string; endDate: string } => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (selectedPeriod) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        break;
      case 'weekly':
        const dayOfWeek = now.getDay();
        startDate = new Date(now);
        startDate.setDate(now.getDate() - dayOfWeek);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'yearly':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
    }

    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
  };

  const handleSave = async () => {
    if (!canSave || !selectedCategoryId) return;

    const { startDate, endDate } = getDateRange(period);

    try {
      await createBudget.mutateAsync({
        categoryId: selectedCategoryId,
        limit: parseFloat(limitAmount),
        period,
        startDate,
        endDate,
        alertThreshold: parseFloat(alertThreshold) || 80,
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to create budget. Please try again.');
    }
  };

  const handleClose = () => {
    if (selectedCategoryId || limitAmount) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to go back?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const getCurrencySymbol = (currency: string) => {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      BDT: '৳',
      INR: '₹',
      JPY: '¥',
    };
    return symbols[currency] || '$';
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-slate-900">
      <View
        className="bg-white dark:bg-slate-800 px-6 pb-4 border-b border-gray-200 dark:border-gray-700"
        style={{ paddingTop: insets.top + 16 }}
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={handleClose} className="p-2">
            <X size={24} color={isDark ? '#F1F5F9' : '#1F2937'} />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900 dark:text-white">
            New Budget
          </Text>
          <TouchableOpacity onPress={handleSave} disabled={!canSave} className="p-2">
            <Check
              size={24}
              color={canSave ? themeColors.primary : isDark ? '#475569' : '#9CA3AF'}
            />
          </TouchableOpacity>
        </View>

        {selectedCategory && (
          <View
            className="mt-4 p-4 rounded-2xl"
            style={{ backgroundColor: `${selectedCategory.color}15` }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View
                  className="w-12 h-12 rounded-xl items-center justify-center"
                  style={{ backgroundColor: `${selectedCategory.color}30` }}
                >
                  <CategoryIcon 
                    iconName={selectedCategory.icon} 
                    size={24} 
                    color={selectedCategory.color} 
                  />
                </View>
                <View>
                  <Text
                    className="font-semibold text-lg"
                    style={{ color: selectedCategory.color }}
                  >
                    {selectedCategory.name}
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-sm capitalize">
                    {period} Budget
                  </Text>
                </View>
              </View>
              <View className="items-end">
                <Text
                  className="text-2xl font-bold"
                  style={{ color: selectedCategory.color }}
                >
                  {getCurrencySymbol(user.currency)}
                  {limitAmount || '0'}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="p-6">
          <Card className="mb-6 p-5">
            <Text className="text-gray-900 dark:text-white font-semibold mb-3">
              Select Category
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              Choose an expense category to set a budget for
            </Text>
            <CategorySelector
              categories={expenseCategories}
              selectedCategoryId={selectedCategoryId}
              onSelect={setSelectedCategoryId}
              disabledCategoryIds={categoriesWithBudget}
            />
            {categoriesWithBudget.length > 0 && (
              <View className="flex-row items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-slate-700">
                <AlertCircle size={14} color="#9CA3AF" />
                <Text className="text-gray-400 dark:text-gray-500 text-xs">
                  Grayed out categories already have a {period} budget
                </Text>
              </View>
            )}
          </Card>

          <Card className="mb-6 p-5">
            <Text className="text-gray-900 dark:text-white font-semibold mb-3">
              Budget Limit
            </Text>
            <View className="flex-row items-center bg-gray-100 dark:bg-slate-700 rounded-xl px-4">
              <Text className="text-gray-500 dark:text-gray-400 text-2xl font-bold mr-2">
                {getCurrencySymbol(user.currency)}
              </Text>
              <TextInput
                className="flex-1 text-gray-900 dark:text-white text-2xl font-bold py-4"
                placeholder="0.00"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
                value={limitAmount}
                onChangeText={setLimitAmount}
              />
            </View>
            <Text className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              Maximum amount you want to spend
            </Text>
          </Card>

          <Card className="mb-6 p-5">
            <Text className="text-gray-900 dark:text-white font-semibold mb-3">
              Budget Period
            </Text>
            <PeriodSelector
              selectedPeriod={period}
              onSelect={(newPeriod) => {
                setPeriod(newPeriod);
                if (
                  selectedCategoryId &&
                  budgets.some(
                    (b) => b.categoryId === selectedCategoryId && b.period === newPeriod
                  )
                ) {
                  setSelectedCategoryId(null);
                }
              }}
              primaryColor={themeColors.primary}
            />
            <View className="flex-row items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-slate-700">
              <Calendar size={14} color="#9CA3AF" />
              <Text className="text-gray-500 dark:text-gray-400 text-xs">
                Budget will reset at the start of each {period.replace('ly', '')}
              </Text>
            </View>
          </Card>

          <Card className="mb-6 p-5">
            <Text className="text-gray-900 dark:text-white font-semibold mb-3">
              Alert Threshold
            </Text>
            <View className="flex-row items-center gap-3">
              <View className="flex-1 flex-row items-center bg-gray-100 dark:bg-slate-700 rounded-xl px-4">
                <TextInput
                  className="flex-1 text-gray-900 dark:text-white text-xl font-bold py-3"
                  placeholder="80"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                  value={alertThreshold}
                  onChangeText={(text) => {
                    const num = parseInt(text);
                    if (!text || (num >= 0 && num <= 100)) {
                      setAlertThreshold(text);
                    }
                  }}
                  maxLength={3}
                />
                <Text className="text-gray-500 dark:text-gray-400 text-xl font-bold">
                  %
                </Text>
              </View>
            </View>
            <Text className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              You'll be notified when spending reaches this percentage
            </Text>
          </Card>

          <View className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4">
            <View className="flex-row items-start gap-3">
              <AlertCircle size={20} color={themeColors.info} />
              <View className="flex-1">
                <Text className="text-blue-800 dark:text-blue-300 font-semibold mb-1">
                  How budgets work
                </Text>
                <Text className="text-blue-700 dark:text-blue-400 text-sm">
                  Your budget tracks all expenses in the selected category. When you add a transaction,
                  the spent amount updates automatically. You'll receive alerts when approaching your limit.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

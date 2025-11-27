import React, { useMemo, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Check, Calendar, AlertCircle } from 'lucide-react-native';
import { useThemeStore, useUserStore, useToastStore } from '../store';
import { useCategories, useBudgets, useCreateBudget } from '../hooks';
import { colors } from '../constants/theme';
import { Card, Loader } from '../components';
import { CategoryIcon } from '../components/shared/CategoryIcon';
import { PeriodSelector, CategorySelector } from '../components/budgets';

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';

// Validation schema matching backend expectations
const budgetSchema = z.object({
  categoryId: z.string().min(1, 'Please select a category'),
  limit: z.string()
    .min(1, 'Budget limit is required')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Limit must be a positive number',
    }),
  period: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  alertThreshold: z.string()
    .refine((val) => !val || (!isNaN(parseInt(val)) && parseInt(val) >= 0 && parseInt(val) <= 100), {
      message: 'Alert threshold must be between 0 and 100',
    }),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

export const AddBudgetScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme } = useThemeStore();
  const { user } = useUserStore();
  const { showSuccess, showError } = useToastStore();
  const themeColors = colors[theme];
  const isDark = theme === 'dark';

  const { data: categoriesData } = useCategories();
  const { data: budgetsData } = useBudgets();
  const createBudget = useCreateBudget();

  const categories = categoriesData?.data || [];
  const budgets = budgetsData?.data || [];

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      categoryId: '',
      limit: '',
      period: 'monthly',
      alertThreshold: '80',
    },
    mode: 'onChange',
  });

  const period = watch('period');
  const categoryId = watch('categoryId');
  const limitAmount = watch('limit');

  const expenseCategories = categories.filter((cat) => (cat.type || '').toLowerCase() === 'expense');
  
  const categoriesWithBudget = useMemo(() => {
    return budgets
      .filter((b) => b.period === period)
      .map((b) => b.categoryId);
  }, [budgets, period]);

  // Reset category when period changes if current category already has a budget for that period
  useEffect(() => {
    if (categoryId && categoriesWithBudget.includes(categoryId)) {
      setValue('categoryId', '');
    }
  }, [period, categoriesWithBudget, categoryId, setValue]);

  const selectedCategory = categoryId
    ? categories.find((c) => c.id === categoryId)
    : null;

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

  const onSubmit = async (data: BudgetFormData) => {
    Keyboard.dismiss();
    
    const { startDate, endDate } = getDateRange(data.period);

    try {
      await createBudget.mutateAsync({
        categoryId: data.categoryId,
        limit: parseFloat(data.limit),
        period: data.period,
        startDate,
        endDate,
        alertThreshold: parseFloat(data.alertThreshold) || 80,
      });
      
      const categoryName = selectedCategory?.name || 'Category';
      showSuccess(
        'Budget Created',
        `${data.period.charAt(0).toUpperCase() + data.period.slice(1)} budget of ${getCurrencySymbol(user.currency)}${parseFloat(data.limit).toFixed(2)} set for ${categoryName}.`
      );
      navigation.goBack();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create budget. Please try again.';
      showError('Error', errorMessage);
    }
  };

  const handleClose = () => {
    if (createBudget.isPending) return;
    navigation.goBack();
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
          <TouchableOpacity onPress={handleClose} disabled={createBudget.isPending} className="p-2">
            <X size={24} color={createBudget.isPending ? (isDark ? '#475569' : '#9CA3AF') : (isDark ? '#F1F5F9' : '#1F2937')} />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900 dark:text-white">
            New Budget
          </Text>
          <TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={!isValid || createBudget.isPending} className="p-2">
            {createBudget.isPending ? (
              <Loader size={24} color={themeColors.primary} />
            ) : (
              <Check
                size={24}
                color={isValid ? themeColors.primary : isDark ? '#475569' : '#9CA3AF'}
              />
            )}
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

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <View className="p-6">
          <Card className="mb-6 p-5">
            <Text className="text-gray-900 dark:text-white font-semibold mb-3">
              Select Category
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              Choose an expense category to set a budget for
            </Text>
            <Controller
              control={control}
              name="categoryId"
              render={({ field: { value, onChange } }) => (
                <View>
                  <CategorySelector
                    categories={expenseCategories}
                    selectedCategoryId={value || null}
                    onSelect={onChange}
                    disabledCategoryIds={categoriesWithBudget}
                    disabled={createBudget.isPending}
                  />
                  {errors.categoryId && (
                    <Text className="text-red-500 text-xs mt-2 ml-1">
                      {errors.categoryId.message}
                    </Text>
                  )}
                </View>
              )}
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
            <Controller
              control={control}
              name="limit"
              render={({ field: { value, onChange, onBlur } }) => (
                <View>
                  <View className="flex-row items-center bg-gray-100 dark:bg-slate-700 rounded-xl px-4">
                    <Text className="text-gray-500 dark:text-gray-400 text-2xl font-bold mr-2">
                      {getCurrencySymbol(user.currency)}
                    </Text>
                    <TextInput
                      className="flex-1 text-gray-900 dark:text-white text-2xl font-bold py-4"
                      placeholder="0.00"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="decimal-pad"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      editable={!createBudget.isPending}
                    />
                  </View>
                  {errors.limit && (
                    <Text className="text-red-500 text-xs mt-2 ml-1">
                      {errors.limit.message}
                    </Text>
                  )}
                </View>
              )}
            />
            <Text className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              Maximum amount you want to spend
            </Text>
          </Card>

          <Card className="mb-6 p-5">
            <Text className="text-gray-900 dark:text-white font-semibold mb-3">
              Budget Period
            </Text>
            <Controller
              control={control}
              name="period"
              render={({ field: { value, onChange } }) => (
                <PeriodSelector
                  selectedPeriod={value}
                  onSelect={onChange}
                  primaryColor={themeColors.primary}
                  disabled={createBudget.isPending}
                />
              )}
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
            <Controller
              control={control}
              name="alertThreshold"
              render={({ field: { value, onChange, onBlur } }) => (
                <View>
                  <View className="flex-row items-center gap-3">
                    <View className="flex-1 flex-row items-center bg-gray-100 dark:bg-slate-700 rounded-xl px-4">
                      <TextInput
                        className="flex-1 text-gray-900 dark:text-white text-xl font-bold py-3"
                        placeholder="80"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="number-pad"
                        value={value}
                        onChangeText={(text) => {
                          const num = parseInt(text);
                          if (!text || (num >= 0 && num <= 100)) {
                            onChange(text);
                          }
                        }}
                        onBlur={onBlur}
                        maxLength={3}
                        editable={!createBudget.isPending}
                      />
                      <Text className="text-gray-500 dark:text-gray-400 text-xl font-bold">
                        %
                      </Text>
                    </View>
                  </View>
                  {errors.alertThreshold && (
                    <Text className="text-red-500 text-xs mt-2 ml-1">
                      {errors.alertThreshold.message}
                    </Text>
                  )}
                </View>
              )}
            />
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

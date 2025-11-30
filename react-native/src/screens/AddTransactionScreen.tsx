import React, { useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Card } from '../components';
import { Loader } from '../components/shared';
import { ScreenHeader, TypeSelector, CategorySelector } from '../components/add-transaction';
import { useThemeStore, useToastStore } from '../store';
import { useCategories, useCreateTransaction, useUserProfile } from '../hooks';
import { colors } from '../constants/theme';
import { DollarSign } from 'lucide-react-native';
import { getCurrencySymbol } from '../utils';

// Validation schema matching backend expectations
const transactionSchema = z.object({
  type: z.enum(['expense', 'revenue']),
  amount: z.string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Amount must be a positive number',
    }),
  categoryId: z.string().min(1, 'Please select a category'),
  accountType: z.enum(['CASH', 'BANK', 'DIGITAL']),
  name: z.string().optional(),
  description: z.string().optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

export const AddTransactionScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories();
  const { data: userResponse, isLoading: isLoadingUser } = useUserProfile();
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  const isDark = theme === 'dark';
  const { showSuccess, showError } = useToastStore();

  const createTransaction = useCreateTransaction();
  const categories = categoriesData?.data || [];
  const user = userResponse?.data;
  const currency = user?.currency || 'USD';
  const currencySymbol = getCurrencySymbol(currency);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      amount: '',
      categoryId: '',
      accountType: 'CASH',
      name: '',
      description: '',
    },
    mode: 'onChange',
  });

  const type = watch('type');
  const categoryId = watch('categoryId');

  const filteredCategories = categories.filter(
    (cat) => (cat.type || '').toLowerCase() === type
  );

  // Show shared full-screen loader while essential data is being fetched
  if (isLoadingCategories || isLoadingUser) {
    return (
      <View className="flex-1 bg-gray-50 dark:bg-slate-900 justify-center items-center">
        <Loader size={64} />
      </View>
    );
  }

  // Reset category when type changes if current category doesn't match
  useEffect(() => {
    if (categoryId) {
      const selectedCat = categories.find((c) => c.id === categoryId);
      if (selectedCat && (selectedCat.type || '').toLowerCase() !== type) {
        setValue('categoryId', '');
      }
    }
  }, [type, categoryId, categories, setValue]);

  const onSubmit = async (data: TransactionFormData) => {
    Keyboard.dismiss();
    
    try {
      await createTransaction.mutateAsync({
        type: data.type,
        amount: parseFloat(data.amount),
        categoryId: data.categoryId,
        accountType: data.accountType,
        name: data.name || undefined,
        description: data.description || undefined,
        date: new Date().toISOString(),
      });
      
      showSuccess(
        'Transaction Added',
        `Your ${data.type} of ${currencySymbol}${parseFloat(data.amount).toFixed(2)} has been recorded.`
      );
      navigation.goBack();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create transaction. Please try again.';
      showError('Error', errorMessage);
    }
  };

  const handleClose = () => {
    if (!createTransaction.isPending) {
      navigation.goBack();
    }
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-slate-900">
      <View style={{ paddingTop: insets.top }}>
        <ScreenHeader
          title="Add Transaction"
          onClose={handleClose}
          onSave={handleSubmit(onSubmit)}
          canSave={isValid && !createTransaction.isPending}
          saveColor={themeColors.primary}
          isDark={isDark}
          isLoading={createTransaction.isPending}
        />
      </View>
      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        <View className="p-4">

        <Card className="mb-6">
          <Controller
            control={control}
            name="type"
            render={({ field: { value, onChange } }) => (
              <TypeSelector type={value} onTypeChange={onChange} isDark={isDark} />
            )}
          />
        </Card>

        <Card className="mb-6">
          <View className="flex-row justify-between mb-2">
            <Text className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Account Type
            </Text>
          </View>
          <Controller
            control={control}
            name="accountType"
            render={({ field: { value, onChange } }) => (
              <View className="flex-row gap-2">
                {(['CASH', 'BANK', 'DIGITAL'] as const).map((acc) => (
                  <TouchableOpacity
                    key={acc}
                    onPress={() => onChange(acc)}
                    disabled={createTransaction.isPending}
                    className="flex-1 py-3 rounded-xl items-center justify-center"
                    style={value === acc ? {
                      backgroundColor: '#EFF6FF',
                      borderWidth: 2,
                      borderColor: '#BFDBFE',
                    } : {
                      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                      borderWidth: 1,
                      borderColor: isDark ? '#334155' : '#E5E7EB',
                    }}
                  >
                    <Text
                      className={`font-semibold ${
                        value === acc
                          ? 'text-blue-700 dark:text-blue-400'
                          : isDark
                          ? 'text-gray-300'
                          : 'text-gray-700'
                      }`}
                    >
                      {acc === 'CASH' ? 'Cash' : acc === 'BANK' ? 'Bank' : 'Digital'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
        </Card>

        <Card className="mb-6">
          <Controller
            control={control}
            name="amount"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                label="Amount *"
                placeholder="0.00"
                keyboardType="decimal-pad"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                icon={<DollarSign size={20} color="#9CA3AF" />}
                error={errors.amount?.message}
                editable={!createTransaction.isPending}
              />
            )}
          />
        </Card>

        <Card className="mb-6">
          <Controller
            control={control}
            name="categoryId"
            render={({ field: { value, onChange } }) => (
              <View>
                <CategorySelector
                  categories={filteredCategories}
                  selectedCategory={value}
                  onSelectCategory={onChange}
                  textColor={themeColors.text.secondary}
                />
                {errors.categoryId && (
                  <Text className="text-red-500 text-xs mt-2 ml-1">
                    {errors.categoryId.message}
                  </Text>
                )}
              </View>
            )}
          />
        </Card>

        <Card className="mb-6">
          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                label="Name (Optional)"
                placeholder="Transaction name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                editable={!createTransaction.isPending}
              />
            )}
          />
        </Card>

        <Card className="mb-6">
          <Controller
            control={control}
            name="description"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                label="Description (Optional)"
                placeholder="Add notes..."
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline={true}
                numberOfLines={3}
                editable={!createTransaction.isPending}
              />
            )}
          />
        </Card>

        <View className="h-6" />
      </View>
    </ScrollView>
    </View>
  );
};

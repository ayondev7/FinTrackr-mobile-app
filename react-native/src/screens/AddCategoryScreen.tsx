import React from 'react';
import { View, Text, ScrollView, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '../components';
import { ScreenHeader, TypeSelector } from '../components/add-transaction';
import { CategoryPreview, CategoryNameInput, ColorPicker, IconPicker } from '../components/add-category';
import { useThemeStore, useToastStore } from '../store';
import { useCreateCategory } from '../hooks';
import { colors } from '../constants/theme';
import { ICON_OPTIONS, COLOR_OPTIONS } from '../constants';
import { ShoppingCart } from 'lucide-react-native';

// Validation schema matching backend expectations
const categorySchema = z.object({
  name: z.string()
    .min(1, 'Category name is required')
    .max(50, 'Category name must be less than 50 characters'),
  type: z.enum(['EXPENSE', 'REVENUE']),
  color: z.string().min(1, 'Please select a color'),
  icon: z.string().min(1, 'Please select an icon'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export const AddCategoryScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  const isDark = theme === 'dark';
  const { showSuccess, showError } = useToastStore();

  const createCategory = useCreateCategory();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      type: 'EXPENSE',
      color: COLOR_OPTIONS[0],
      icon: ICON_OPTIONS[0].name,
    },
    mode: 'onChange',
  });

  const selectedColor = watch('color');
  const selectedIcon = watch('icon');

  const getIconComponent = (iconName: string) => {
    const icon = ICON_OPTIONS.find(i => i.name === iconName);
    return icon ? icon.component : ShoppingCart;
  };

  const IconComponent = getIconComponent(selectedIcon);

  const onSubmit = async (data: CategoryFormData) => {
    Keyboard.dismiss();
    
    try {
      await createCategory.mutateAsync({
        name: data.name.trim(),
        type: data.type,
        color: data.color,
        icon: data.icon,
        isPinned: false,
      });
      
      showSuccess(
        'Category Created',
        `"${data.name.trim()}" has been added to your categories.`
      );
      navigation.goBack();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create category. Please try again.';
      showError('Error', errorMessage);
    }
  };

  const handleClose = () => {
    if (!createCategory.isPending) {
      navigation.goBack();
    }
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-slate-900">
      <View 
        className="bg-white dark:bg-slate-800 px-6 pb-4"
        style={{ paddingTop: insets.top + 16 }}
      >
        <ScreenHeader
          title="New Category"
          onClose={handleClose}
          onSave={handleSubmit(onSubmit)}
          canSave={isValid && !createCategory.isPending}
          saveColor={selectedColor}
          isDark={isDark}
          isLoading={createCategory.isPending}
        />

        <CategoryPreview color={selectedColor} IconComponent={IconComponent} />
      </View>

      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        <View className="p-6">
          <Card className="mb-6 p-5">
            <Text className="text-gray-900 dark:text-white font-semibold mb-3">
              Category Name
            </Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange, onBlur } }) => (
                <View>
                  <CategoryNameInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    color={selectedColor}
                    isDark={isDark}
                    editable={!createCategory.isPending}
                  />
                  {errors.name && (
                    <Text className="text-red-500 text-xs mt-2 ml-1">
                      {errors.name.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </Card>

          <Card className="mb-6 p-5">
            <Text className="text-gray-900 dark:text-white font-semibold mb-3">
              Category Type
            </Text>
            <Controller
              control={control}
              name="type"
              render={({ field: { value, onChange } }) => (
                <TypeSelector 
                  type={value === 'EXPENSE' ? 'expense' : 'revenue'} 
                  onTypeChange={(type) => onChange(type === 'expense' ? 'EXPENSE' : 'REVENUE')} 
                  isDark={isDark}
                  disabled={createCategory.isPending}
                />
              )}
            />
          </Card>

          <Card className="mb-6 p-5">
            <Text className="text-gray-900 dark:text-white font-semibold mb-3">
              Choose Color
            </Text>
            <Controller
              control={control}
              name="color"
              render={({ field: { value, onChange } }) => (
                <ColorPicker
                  colors={COLOR_OPTIONS}
                  selectedColor={value}
                  onSelectColor={onChange}
                  disabled={createCategory.isPending}
                />
              )}
            />
          </Card>

          <Card className="mb-6 p-5">
            <Text className="text-gray-900 dark:text-white font-semibold mb-3">
              Choose Icon
            </Text>
            <Controller
              control={control}
              name="icon"
              render={({ field: { value, onChange } }) => (
                <IconPicker
                  icons={ICON_OPTIONS}
                  selectedIcon={value}
                  onSelectIcon={onChange}
                  selectedColor={selectedColor}
                  isDark={isDark}
                  disabled={createCategory.isPending}
                />
              )}
            />
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

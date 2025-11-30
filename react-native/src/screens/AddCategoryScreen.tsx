import React from 'react';
import { View, Text, ScrollView, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '../components';
import { Loader } from '../components/shared';
import { ScreenHeader, TypeSelector } from '../components/add-transaction';
import { CategoryPreview, CategoryNameInput, ColorPicker, IconPicker } from '../components/add-category';
import { useThemeStore, useToastStore } from '../store';
import { useCreateCategory } from '../hooks';
import { colors } from '../constants/theme';
// ICON_OPTIONS and COLOR_OPTIONS are large — lazy-load them to avoid blocking navigation
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

  const [iconOptions, setIconOptions] = React.useState<any[] | null>(null);
  const [colorOptions, setColorOptions] = React.useState<string[] | null>(null);
  const [isPreparing, setIsPreparing] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const mod = await import('../constants/categoryOptions');
        if (!mounted) return;
        setIconOptions(mod.ICON_OPTIONS || []);
        setColorOptions(mod.COLOR_OPTIONS || []);
      } catch (err) {
        console.error('Failed to load category options:', err);
        setIconOptions([]);
        setColorOptions([]);
      } finally {
        if (mounted) setIsPreparing(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      type: 'EXPENSE',
      // will be set after options load; use placeholders for now
      color: '',
      icon: '',
    },
    mode: 'onChange',
  });

  const selectedColor = watch('color');
  const selectedIcon = watch('icon');

  // When options load, set sensible defaults into the form if they're empty
  React.useEffect(() => {
    if (!isPreparing && colorOptions && iconOptions) {
      if ((!selectedColor || selectedColor === '') && colorOptions.length > 0) {
        setValue('color', colorOptions[0]);
      }
      if ((!selectedIcon || selectedIcon === '') && iconOptions.length > 0) {
        setValue('icon', iconOptions[0].name);
      }
    }
  }, [isPreparing, colorOptions, iconOptions, selectedColor, selectedIcon, setValue]);

  const getIconComponent = (iconName: string) => {
    const icon = (iconOptions || []).find((i: any) => i.name === iconName);
    return icon ? icon.component : ShoppingCart;
  };

  const IconComponent = getIconComponent(selectedIcon);

  if (isPreparing) {
    return (
      <View className="flex-1 bg-gray-50 dark:bg-slate-900 justify-center items-center">
        <Loader size={64} />
      </View>
    );
  }

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
        className="bg-white dark:bg-slate-800 pb-4"
        style={{ paddingTop: insets.top + 16, paddingLeft: Math.max(insets.left, 24), paddingRight: Math.max(insets.right, 24) }}
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

      <ScrollView 
        className="flex-1" 
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingLeft: Math.max(insets.left, 24), paddingRight: Math.max(insets.right, 24) }}
      >
        <View className="py-6">
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
                  colors={colorOptions || []}
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
                  icons={iconOptions || []}
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

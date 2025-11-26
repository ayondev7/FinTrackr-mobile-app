import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Card } from '../components';
import { ScreenHeader, TypeSelector } from '../components/add-transaction';
import { CategoryPreview, CategoryNameInput, ColorPicker, IconPicker } from '../components/add-category';
import { useThemeStore } from '../store';
import { useCreateCategory } from '../hooks';
import { colors } from '../constants/theme';
import { ICON_OPTIONS, COLOR_OPTIONS } from '../constants';
import { ShoppingCart } from 'lucide-react-native';

export const AddCategoryScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  const isDark = theme === 'dark';

  const createCategory = useCreateCategory();

  const [categoryName, setCategoryName] = useState('');
  const [selectedType, setSelectedType] = useState<'EXPENSE' | 'REVENUE'>('EXPENSE');
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [selectedIcon, setSelectedIcon] = useState(ICON_OPTIONS[0].name);

  const getIconComponent = (iconName: string) => {
    const icon = ICON_OPTIONS.find(i => i.name === iconName);
    return icon ? icon.component : ShoppingCart;
  };

  const IconComponent = getIconComponent(selectedIcon);

  const handleSave = async () => {
    if (!categoryName.trim() || createCategory.isPending) return;

    try {
      await createCategory.mutateAsync({
        name: categoryName.trim(),
        type: selectedType,
        color: selectedColor,
        icon: selectedIcon,
        isPinned: false,
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to create category. Please try again.');
    }
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-slate-900">
      <View 
        className="bg-white dark:bg-slate-800 px-6 pb-4 border-b border-gray-200 dark:border-gray-700"
        style={{ paddingTop: insets.top + 16 }}
      >
        <ScreenHeader
          title="New Category"
          onClose={() => navigation.goBack()}
          onSave={handleSave}
          canSave={!!categoryName.trim() && !createCategory.isPending}
          saveColor={selectedColor}
          isDark={isDark}
        />

        <CategoryPreview color={selectedColor} IconComponent={IconComponent} />
      </View>

      <ScrollView className="flex-1">
        <View className="p-6">
          <Card className="mb-6 p-5">
            <Text className="text-gray-900 dark:text-white font-semibold mb-3">
              Category Name
            </Text>
            <CategoryNameInput
              value={categoryName}
              onChangeText={setCategoryName}
              color={selectedColor}
              isDark={isDark}
            />
          </Card>

          <Card className="mb-6 p-5">
            <Text className="text-gray-900 dark:text-white font-semibold mb-3">
              Category Type
            </Text>
            <TypeSelector 
              type={selectedType === 'EXPENSE' ? 'expense' : 'revenue'} 
              onTypeChange={(type) => setSelectedType(type === 'expense' ? 'EXPENSE' : 'REVENUE')} 
              isDark={isDark} 
            />
          </Card>

          <Card className="mb-6 p-5">
            <Text className="text-gray-900 dark:text-white font-semibold mb-3">
              Choose Color
            </Text>
            <ColorPicker
              colors={COLOR_OPTIONS}
              selectedColor={selectedColor}
              onSelectColor={setSelectedColor}
            />
          </Card>

          <Card className="mb-6 p-5">
            <Text className="text-gray-900 dark:text-white font-semibold mb-3">
              Choose Icon
            </Text>
            <IconPicker
              icons={ICON_OPTIONS}
              selectedIcon={selectedIcon}
              onSelectIcon={setSelectedIcon}
              selectedColor={selectedColor}
              isDark={isDark}
            />
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

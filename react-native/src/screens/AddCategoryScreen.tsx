import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Card, Button } from '../components';
import { useThemeStore } from '../store';
import { colors } from '../constants/theme';
import { ICON_OPTIONS, COLOR_OPTIONS } from '../constants';
import { X, Check, ShoppingCart } from 'lucide-react-native';

export const AddCategoryScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  const isDark = theme === 'dark';

  const [categoryName, setCategoryName] = useState('');
  const [selectedType, setSelectedType] = useState<'expense' | 'revenue'>('expense');
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [selectedIcon, setSelectedIcon] = useState(ICON_OPTIONS[0].name);

  const getIconComponent = (iconName: string) => {
    const icon = ICON_OPTIONS.find(i => i.name === iconName);
    return icon ? icon.component : ShoppingCart;
  };

  const IconComponent = getIconComponent(selectedIcon);

  const handleSave = () => {
    console.log('Saving category:', {
      name: categoryName,
      type: selectedType,
      color: selectedColor,
      icon: selectedIcon,
    });
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-slate-900">
      <View 
        className="bg-white dark:bg-slate-800 px-6 pb-4 border-b border-gray-200 dark:border-gray-700"
        style={{ paddingTop: insets.top + 16 }}
      >
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2"
          >
            <X size={24} color={isDark ? '#F1F5F9' : '#1F2937'} />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900 dark:text-white">
            New Category
          </Text>
          <TouchableOpacity
            onPress={handleSave}
            disabled={!categoryName.trim()}
            className="p-2"
          >
            <Check 
              size={24} 
              color={categoryName.trim() ? selectedColor : isDark ? '#475569' : '#9CA3AF'} 
            />
          </TouchableOpacity>
        </View>

        <View 
          className="w-20 h-20 rounded-2xl items-center justify-center self-center mb-4"
          style={{ backgroundColor: `${selectedColor}20` }}
        >
          <IconComponent size={40} color={selectedColor} />
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="p-6">
          <Card className="mb-6 p-5">
            <Text className="text-gray-900 dark:text-white font-semibold mb-3">
              Category Name
            </Text>
            <TextInput
              className="bg-gray-50 dark:bg-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-base"
              placeholder="Enter category name"
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
              value={categoryName}
              onChangeText={setCategoryName}
              style={{ 
                borderWidth: 2,
                borderColor: categoryName ? selectedColor : isDark ? '#334155' : '#E5E7EB'
              }}
            />
          </Card>

          <Card className="mb-6 p-5">
            <Text className="text-gray-900 dark:text-white font-semibold mb-3">
              Category Type
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setSelectedType('expense')}
                className={`flex-1 py-3 rounded-xl items-center ${
                  selectedType === 'expense'
                    ? 'bg-red-500'
                    : 'bg-gray-100 dark:bg-slate-700'
                }`}
              >
                <Text
                  className={`font-semibold ${
                    selectedType === 'expense'
                      ? 'text-white'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Expense
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSelectedType('revenue')}
                className={`flex-1 py-3 rounded-xl items-center ${
                  selectedType === 'revenue'
                    ? 'bg-green-500'
                    : 'bg-gray-100 dark:bg-slate-700'
                }`}
              >
                <Text
                  className={`font-semibold ${
                    selectedType === 'revenue'
                      ? 'text-white'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Revenue
                </Text>
              </TouchableOpacity>
            </View>
          </Card>

          <Card className="mb-6 p-5">
            <Text className="text-gray-900 dark:text-white font-semibold mb-3">
              Choose Color
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {COLOR_OPTIONS.map((color) => (
                <TouchableOpacity
                  key={color}
                  onPress={() => setSelectedColor(color)}
                  className="w-14 h-14 rounded-xl items-center justify-center"
                  style={{ 
                    backgroundColor: color,
                    opacity: selectedColor === color ? 1 : 0.5,
                    transform: [{ scale: selectedColor === color ? 1.1 : 1 }]
                  }}
                >
                  {selectedColor === color && (
                    <Check size={24} color="#FFFFFF" strokeWidth={3} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          <Card className="mb-6 p-5">
            <Text className="text-gray-900 dark:text-white font-semibold mb-3">
              Choose Icon
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {ICON_OPTIONS.map((icon) => {
                const Icon = icon.component;
                return (
                  <TouchableOpacity
                    key={icon.name}
                    onPress={() => setSelectedIcon(icon.name)}
                    className="w-14 h-14 rounded-xl items-center justify-center"
                    style={{ 
                      backgroundColor: selectedIcon === icon.name 
                        ? `${selectedColor}30` 
                        : isDark ? '#334155' : '#F3F4F6',
                      borderWidth: 2,
                      borderColor: selectedIcon === icon.name ? selectedColor : 'transparent'
                    }}
                  >
                    <Icon 
                      size={24} 
                      color={selectedIcon === icon.name ? selectedColor : isDark ? '#94A3B8' : '#6B7280'} 
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

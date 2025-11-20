import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Input, Card } from '../components';
import { useCategoryStore, useThemeStore } from '../store';
import { colors } from '../constants/theme';
import { ArrowUpCircle, ArrowDownCircle, DollarSign, X, Check } from 'lucide-react-native';

export const AddTransactionScreen = () => {
  const insets = useSafeAreaInsets();
  const { categories } = useCategoryStore();
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  const isDark = theme === 'dark';

  const [type, setType] = useState<'expense' | 'revenue'>('expense');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);

  const filteredCategories = categories.filter(
    (cat) => cat.type === type || cat.type === 'both'
  );

  const handleSubmit = () => {
    console.log('Transaction submitted:', {
      type,
      amount,
      selectedCategory,
      name,
      description,
      isRecurring,
    });
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-slate-900">
      <View 
        className="bg-white dark:bg-slate-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-row items-center justify-between"
        style={{ paddingTop: insets.top + 16 }}
      >
        <TouchableOpacity onPress={() => {}} className="p-2">
          <X size={24} color={isDark ? '#F1F5F9' : '#1F2937'} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900 dark:text-white">
          Add Transaction
        </Text>
        <TouchableOpacity 
          onPress={handleSubmit}
          disabled={!amount.trim() || !selectedCategory}
          className="p-2"
        >
          <Check 
            size={24} 
            color={(amount.trim() && selectedCategory) ? themeColors.primary : isDark ? '#475569' : '#9CA3AF'} 
          />
        </TouchableOpacity>
      </View>
      <ScrollView className="flex-1">
        <View className="p-4">

        <Card className="mb-6">
          <Text className="text-gray-700 dark:text-gray-300 font-medium mb-3">
            Transaction Type
          </Text>
          <View className="flex-row gap-3 mb-4">
            <TouchableOpacity
              onPress={() => setType('expense')}
              className={`flex-1 py-3 rounded-xl flex-row items-center justify-center gap-2 ${
                type === 'expense'
                  ? 'bg-red-500'
                  : 'bg-gray-100 dark:bg-slate-700'
              }`}
            >
              <ArrowUpCircle 
                size={20} 
                color={type === 'expense' ? '#FFF' : isDark ? '#D1D5DB' : '#374151'} 
              />
              <Text
                className={`text-center font-semibold ${
                  type === 'expense'
                    ? 'text-white'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                Expense
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setType('revenue')}
              className={`flex-1 py-3 rounded-xl flex-row items-center justify-center gap-2 ${
                type === 'revenue'
                  ? 'bg-green-500'
                  : 'bg-gray-100 dark:bg-slate-700'
              }`}
            >
              <ArrowDownCircle 
                size={20} 
                color={type === 'revenue' ? '#FFF' : isDark ? '#D1D5DB' : '#374151'} 
              />
              <Text
                className={`text-center font-semibold ${
                  type === 'revenue'
                    ? 'text-white'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                Revenue
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Card className="mb-6">
          <Input
            label="Amount *"
            placeholder="0.00"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
            icon={<DollarSign size={20} color="#9CA3AF" />}
          />
        </Card>

        <Card className="mb-6">
          <Text className="text-gray-700 dark:text-gray-300 font-medium mb-3">
            Category *
          </Text>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            className="flex-row -mx-1"
          >
            {filteredCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
                className="mx-1"
              >
                <View
                  className={`px-4 py-3 rounded-xl ${
                    selectedCategory === category.id
                      ? 'border-2'
                      : 'border border-gray-200 dark:border-gray-700'
                  }`}
                  style={{
                    backgroundColor: `${category.color}${
                      selectedCategory === category.id ? '30' : '10'
                    }`,
                    borderColor:
                      selectedCategory === category.id
                        ? category.color
                        : 'transparent',
                  }}
                >
                  <Text
                    className="font-medium"
                    style={{
                      color:
                        selectedCategory === category.id
                          ? category.color
                          : themeColors.text.secondary,
                    }}
                  >
                    {category.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Card>

        <Card className="mb-6">
          <Input
            label="Name (Optional)"
            placeholder="Transaction name"
            value={name}
            onChangeText={setName}
          />
        </Card>

        <Card className="mb-6">
          <Input
            label="Description (Optional)"
            placeholder="Add notes..."
            value={description}
            onChangeText={setDescription}
            multiline={true}
            numberOfLines={3}
          />
        </Card>

        <Card className="mb-6">
          <TouchableOpacity
            onPress={() => setIsRecurring(!isRecurring)}
            className="flex-row items-center justify-between"
          >
            <View>
              <Text className="text-gray-900 dark:text-white font-medium mb-1">
                Recurring Transaction
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-sm">
                Automatically repeat this transaction
              </Text>
            </View>
            <View
              className={`w-12 h-7 rounded-full p-1 ${
                isRecurring
                  ? 'bg-indigo-600 dark:bg-indigo-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <View
                className={`w-5 h-5 rounded-full bg-white ${
                  isRecurring ? 'ml-auto' : ''
                }`}
              />
            </View>
          </TouchableOpacity>
        </Card>

        <View className="h-6" />
      </View>
    </ScrollView>
    </View>
  );
};

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Input, Card } from '../components';
import { useCategoryStore, useThemeStore } from '../store';
import { colors } from '../constants/theme';

export const AddTransactionScreen = () => {
  const { categories } = useCategoryStore();
  const { theme } = useThemeStore();
  const themeColors = colors[theme];

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
    <ScrollView className="flex-1 bg-gray-50 dark:bg-slate-900">
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Add Transaction
        </Text>

        <Card className="mb-6">
          <Text className="text-gray-700 dark:text-gray-300 font-medium mb-3">
            Transaction Type
          </Text>
          <View className="flex-row gap-3 mb-4">
            <TouchableOpacity
              onPress={() => setType('expense')}
              className={`flex-1 py-3 rounded-xl ${
                type === 'expense'
                  ? 'bg-red-500'
                  : 'bg-gray-100 dark:bg-slate-700'
              }`}
            >
              <Text
                className={`text-center font-semibold ${
                  type === 'expense'
                    ? 'text-white'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                📤 Expense
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setType('revenue')}
              className={`flex-1 py-3 rounded-xl ${
                type === 'revenue'
                  ? 'bg-green-500'
                  : 'bg-gray-100 dark:bg-slate-700'
              }`}
            >
              <Text
                className={`text-center font-semibold ${
                  type === 'revenue'
                    ? 'text-white'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                📥 Revenue
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
            icon={<Text className="text-gray-400 text-lg">$</Text>}
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

        <View className="flex-row gap-3 mb-6">
          <Button
            title="Cancel"
            variant="outline"
            onPress={() => {}}
            fullWidth
          />
          <Button title="Add Transaction" onPress={handleSubmit} fullWidth />
        </View>

        <View className="h-6" />
      </View>
    </ScrollView>
  );
};

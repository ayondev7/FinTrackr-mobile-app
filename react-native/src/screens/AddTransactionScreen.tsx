import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Input, Card } from '../components';
import { ScreenHeader, TypeSelector, CategorySelector } from '../components/add-transaction';
import { useThemeStore } from '../store';
import { useCategories } from '../hooks';
import { colors } from '../constants/theme';
import { DollarSign } from 'lucide-react-native';
import { Text, TouchableOpacity } from 'react-native';

export const AddTransactionScreen = () => {
  const insets = useSafeAreaInsets();
  const { data: categoriesData } = useCategories();
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  const isDark = theme === 'dark';

  const categories = categoriesData?.data || [];

  const [type, setType] = useState<'expense' | 'revenue'>('expense');
  const [accountType, setAccountType] = useState<'CASH' | 'BANK' | 'DIGITAL'>('CASH');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const filteredCategories = categories.filter(
    (cat) => (cat.type || '').toLowerCase() === (type === 'expense' ? 'expense' : 'revenue')
  );

  const handleSubmit = () => {
    console.log('Transaction submitted', {
      type,
      accountType,
      amount,
      selectedCategory,
      name,
      description
    });
    // TODO: Call API to create transaction
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-slate-900">
      <View style={{ paddingTop: insets.top }}>
        <ScreenHeader
          title="Add Transaction"
          onClose={() => {}}
          onSave={handleSubmit}
          canSave={!!amount.trim() && !!selectedCategory}
          saveColor={themeColors.primary}
          isDark={isDark}
        />
      </View>
      <ScrollView className="flex-1">
        <View className="p-4">

        <Card className="mb-6">
          <TypeSelector type={type} onTypeChange={setType} isDark={isDark} />
        </Card>

        <Card className="mb-6">
          <View className="flex-row justify-between mb-2">
            <Text className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Account Type
            </Text>
          </View>
          <View className="flex-row gap-2">
            {(['CASH', 'BANK', 'DIGITAL'] as const).map((acc) => (
              <TouchableOpacity
                key={acc}
                onPress={() => setAccountType(acc)}
                className={`flex-1 py-3 rounded-xl items-center justify-center border ${
                  accountType === acc
                    ? 'bg-indigo-600 border-indigo-600'
                    : isDark
                    ? 'bg-slate-800 border-slate-700'
                    : 'bg-white border-gray-200'
                }`}
              >
                <Text
                  className={`font-semibold ${
                    accountType === acc
                      ? 'text-white'
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
          <CategorySelector
            categories={filteredCategories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            textColor={themeColors.text.secondary}
          />
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

        <View className="h-6" />
      </View>
    </ScrollView>
    </View>
  );
};

import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Input, Card } from '../components';
import { ScreenHeader, TypeSelector, CategorySelector, RecurringToggle } from '../components/add-transaction';
import { useCategoryStore, useThemeStore } from '../store';
import { colors } from '../constants/theme';
import { DollarSign } from 'lucide-react-native';

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
    console.log('Transaction submitted');
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

        <Card className="mb-6">
          <RecurringToggle isRecurring={isRecurring} onToggle={() => setIsRecurring(!isRecurring)} />
        </Card>

        <View className="h-6" />
      </View>
    </ScrollView>
    </View>
  );
};

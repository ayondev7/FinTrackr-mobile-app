import React, { useState, useMemo } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Save } from 'lucide-react-native';
import { Card } from '../shared/Card';
import { useCategories, useUserProfile } from '../../hooks';
import { getCurrencySymbol } from '../../utils/helpers';

interface BudgetModalProps {
  visible: boolean;
  onClose: () => void;
  warningColor: string;
}

export const BudgetModal = ({ visible, onClose, warningColor }: BudgetModalProps) => {
  const insets = useSafeAreaInsets();
  const { data: categoriesData, isLoading } = useCategories();
  const { data: userResponse } = useUserProfile();
  const user = userResponse?.data;
  const currencySymbol = getCurrencySymbol(user?.currency ?? 'USD');
  
  const categories = categoriesData?.data || [];
  
  const expenseCategories = useMemo(() => 
    categories.filter((cat) => (cat.type || '').toLowerCase() === 'expense'),
    [categories]
  );
  
  const [budgets, setBudgets] = useState<{ [key: string]: string }>({});

  const handleBudgetChange = (categoryId: string, value: string) => {
    setBudgets(prev => ({ ...prev, [categoryId]: value }));
  };

  const handleSave = () => {
    // TODO: Save budgets via API
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <View 
          className="flex-1 mt-20 bg-gray-50 dark:bg-slate-900 rounded-t-3xl"
          style={{ marginLeft: insets.left, marginRight: insets.right }}
        >
          <View className="flex-row items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <Text className="text-gray-900 dark:text-white text-xl font-bold">
              Budget Settings
            </Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <ScrollView className="flex-1 p-6" contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 24) }}>
            <View className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl">
              <Text className="text-yellow-800 dark:text-yellow-300 text-sm">
                Set monthly budget limits for each expense category
              </Text>
            </View>

            {isLoading ? (
              <View className="py-8 items-center">
                <ActivityIndicator size="large" color="#6366F1" />
              </View>
            ) : expenseCategories.length === 0 ? (
              <View className="py-8 items-center">
                <Text className="text-gray-500 dark:text-gray-400">
                  No expense categories found
                </Text>
              </View>
            ) : (
              expenseCategories.map((category) => (
                <Card key={category.id} className="mb-3 p-4">
                  <View className="flex-row items-center gap-3 mb-3">
                    <View
                      className="w-10 h-10 rounded-xl items-center justify-center"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <View
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                    </View>
                    <Text className="text-gray-900 dark:text-white font-semibold flex-1">
                      {category.name}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-gray-500 dark:text-gray-400">{currencySymbol}</Text>
                    <TextInput
                      className="flex-1 bg-gray-100 dark:bg-slate-800 px-4 py-3 rounded-xl text-gray-900 dark:text-white font-semibold"
                      placeholder="0.00"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="decimal-pad"
                      value={budgets[category.id] || ''}
                      onChangeText={(value) => handleBudgetChange(category.id, value)}
                    />
                    <Text className="text-gray-500 dark:text-gray-400 text-sm">
                      / month
                    </Text>
                  </View>
                </Card>
              ))
            )}

            <TouchableOpacity
              className="mt-4 p-4 rounded-2xl flex-row items-center justify-center gap-2"
              style={{ backgroundColor: warningColor }}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Save size={20} color="#FFFFFF" />
              <Text className="text-white font-semibold text-base">
                Save Budgets
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

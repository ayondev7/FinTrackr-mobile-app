import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Transaction } from '../types';
import { CategoryBadge } from './CategoryBadge';
import { useThemeStore } from '../store/themeStore';
import { colors } from '../constants/theme';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react-native';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onPress,
}) => {
  const { theme } = useThemeStore();
  const themeColors = colors[theme as keyof typeof colors];
  const isDark = theme === 'dark';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatAmount = (amount: number, type: string) => {
    const sign = type === 'expense' ? '-' : '+';
    return `${sign}$${amount.toFixed(2)}`;
  };

  const getCategoryColor = (categoryId: string) => {
    const colorMap: Record<string, string> = {
      'cat-1': themeColors.category.groceries,
      'cat-2': themeColors.category.healthcare,
      'cat-3': themeColors.category.transportation,
      'cat-4': themeColors.category.entertainment,
      'cat-5': themeColors.category.dining,
      'cat-6': themeColors.category.utilities,
      'cat-7': themeColors.category.shopping,
      'cat-8': themeColors.category.education,
      'cat-9': themeColors.category.salary,
      'cat-10': themeColors.category.freelance,
      'cat-11': themeColors.category.investment,
      'cat-12': themeColors.category.gift,
    };
    return colorMap[categoryId] || themeColors.primary;
  };

  const isExpense = transaction.type === 'expense';
  const Icon = isExpense ? ArrowUpRight : ArrowDownLeft;
  const iconColor = isExpense ? '#EF4444' : '#22C55E'; // red-500 : green-500

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-3 shadow-sm border border-gray-100 dark:border-slate-700"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <View className="flex-row items-center gap-3 mb-2">
            <View
              className="w-12 h-12 rounded-xl items-center justify-center"
              style={{ backgroundColor: `${getCategoryColor(transaction.categoryId)}20` }}
            >
              <Icon size={24} color={getCategoryColor(transaction.categoryId)} />
            </View>
            
            <View className="flex-1">
              <Text className="text-gray-900 dark:text-white font-semibold text-base mb-1">
                {transaction.name || transaction.category}
              </Text>
              <CategoryBadge
                name={transaction.category}
                color={getCategoryColor(transaction.categoryId)}
                size="sm"
              />
            </View>
          </View>
          
          {transaction.description && (
            <Text className="text-gray-500 dark:text-gray-400 text-sm mb-2 ml-15">
              {transaction.description}
            </Text>
          )}
          
          <View className="flex-row items-center gap-3 ml-15">
            <Text className="text-gray-400 dark:text-gray-500 text-xs">
              {formatDate(transaction.date)}
            </Text>
            {transaction.wallet && (
              <>
                <View className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                <Text className="text-gray-400 dark:text-gray-500 text-xs">
                  {transaction.wallet}
                </Text>
              </>
            )}
          </View>
        </View>
        
        <View className="items-end ml-3">
          <Text
            className={`text-lg font-bold ${
              isExpense
                ? 'text-red-500'
                : 'text-green-500'
            }`}
          >
            {formatAmount(transaction.amount, transaction.type)}
          </Text>
          {transaction.isRecurring && (
            <View className="mt-1 bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 rounded-full">
              <Text className="text-purple-600 dark:text-purple-400 text-xs font-medium">
                Recurring
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

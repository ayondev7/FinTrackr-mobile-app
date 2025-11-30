import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Transaction } from '../../types';
import { CategoryBadge } from './CategoryBadge';
import { useThemeStore } from '../../store/themeStore';
import { colors } from '../../constants/theme';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react-native';
import { formatAmount as formatAmountWithCommas, getCurrencySymbol, formatSmartCurrency } from '../../utils/helpers';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
  currency?: string;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onPress,
  currency = 'USD',
}) => {
  const { theme } = useThemeStore();
  const themeColors = colors[theme as keyof typeof colors];
  const currencySymbol = getCurrencySymbol(currency);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatAmount = (amount: number, type: string) => {
    const sign = type === 'expense' ? '-' : '+';
    return `${sign}${formatSmartCurrency(amount, currency, 100000, 1)}`;
  };

  const formatAccountType = (accountType: string) => {
    const accountTypeMap: Record<string, string> = {
      'CASH': 'Cash',
      'BANK': 'Bank',
      'DIGITAL': 'Digital',
    };
    return accountTypeMap[accountType] || accountType;
  };

  const categoryColor = transaction.categoryColor || themeColors.primary;

  const isExpense = transaction.type === 'expense';
  const Icon = isExpense ? ArrowUpRight : ArrowDownLeft;

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
              style={{ backgroundColor: `${categoryColor}20` }}
            >
              <Icon size={24} color={categoryColor} />
            </View>
            
            <View className="flex-1">
              <Text className="text-gray-900 dark:text-white font-semibold text-base mb-1">
                {transaction.name || transaction.category}
              </Text>
              <CategoryBadge
                name={transaction.category}
                color={categoryColor}
                size="sm"
              />
            </View>
          </View>
          
          {transaction.description && (
            <Text className="text-gray-500 dark:text-gray-400 text-sm mb-2 ml-15">
              {transaction.description}
            </Text>
          )}
          
          <View className="flex-row items-center gap-2 ml-15">
            <Text className="text-gray-400 dark:text-gray-500 text-xs">
              {formatDate(transaction.date)}
            </Text>
            <Text className="text-gray-400 dark:text-gray-500 text-xs">•</Text>
            <Text className="text-gray-400 dark:text-gray-500 text-xs">
              {formatAccountType(transaction.accountType)}
            </Text>
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
        </View>
      </View>
    </TouchableOpacity>
  );
};

import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card } from '../shared/Card';
import { formatCurrency } from '../../utils/helpers';
import { Transaction } from '../../types';

type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface TimeBreakdownProps {
  transactions: Transaction[];
  categoryColor: string;
  currency: string;
}

const getDateRangeForPeriod = (period: TimePeriod): { start: Date; end: Date } => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (period) {
    case 'daily':
      return {
        start: startOfDay,
        end: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1),
      };
    case 'weekly':
      const startOfWeek = new Date(startOfDay);
      startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
      return {
        start: startOfWeek,
        end: new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000 - 1),
      };
    case 'monthly':
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      return { start: startOfMonth, end: endOfMonth };
    case 'yearly':
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
      return { start: startOfYear, end: endOfYear };
  }
};

const getPeriodLabel = (period: TimePeriod): string => {
  switch (period) {
    case 'daily':
      return 'Today';
    case 'weekly':
      return 'This Week';
    case 'monthly':
      return 'This Month';
    case 'yearly':
      return 'This Year';
  }
};

export const TimeBreakdown = ({ transactions, categoryColor, currency }: TimeBreakdownProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('monthly');

  const periods: TimePeriod[] = ['daily', 'weekly', 'monthly', 'yearly'];

  const calculatePeriodData = (period: TimePeriod) => {
    const { start, end } = getDateRangeForPeriod(period);
    const filteredTransactions = transactions.filter((txn) => {
      const txnDate = new Date(txn.date);
      return txnDate >= start && txnDate <= end;
    });

    const total = filteredTransactions.reduce((sum, txn) => sum + txn.amount, 0);
    const count = filteredTransactions.length;
    const avg = count > 0 ? total / count : 0;

    return { total, count, avg };
  };

  if (transactions.length === 0) {
    return null;
  }

  const periodData = calculatePeriodData(selectedPeriod);

  return (
    <>
      <Text className="text-gray-900 dark:text-white text-xl font-bold mb-4">
        Time Breakdown
      </Text>

      <View className="flex-row mb-4 gap-2">
        {periods.map((period) => (
          <TouchableOpacity
            key={period}
            onPress={() => setSelectedPeriod(period)}
            className={`flex-1 py-2 rounded-xl ${
              selectedPeriod === period ? 'bg-opacity-100' : 'bg-gray-100 dark:bg-slate-800'
            }`}
            style={selectedPeriod === period ? { backgroundColor: `${categoryColor}20` } : undefined}
          >
            <Text
              className={`text-center text-xs font-semibold capitalize ${
                selectedPeriod === period ? '' : 'text-gray-500 dark:text-gray-400'
              }`}
              style={selectedPeriod === period ? { color: categoryColor } : undefined}
            >
              {period}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Card className="mb-6 p-4">
        <Text className="text-gray-500 dark:text-gray-400 text-sm mb-2">
          {getPeriodLabel(selectedPeriod)}
        </Text>
        <Text className="text-3xl font-bold mb-4" style={{ color: categoryColor }}>
          {formatCurrency(periodData.total, currency)}
        </Text>
        <View className="flex-row gap-4">
          <View className="flex-1">
            <Text className="text-gray-500 dark:text-gray-400 text-xs mb-1">
              Transactions
            </Text>
            <Text className="text-gray-900 dark:text-white font-semibold">
              {periodData.count}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-gray-500 dark:text-gray-400 text-xs mb-1">
              Avg. Amount
            </Text>
            <Text className="text-gray-900 dark:text-white font-semibold">
              {formatCurrency(periodData.avg, currency)}
            </Text>
          </View>
        </View>
      </Card>
    </>
  );
};

export const BreakdownByType = TimeBreakdown;

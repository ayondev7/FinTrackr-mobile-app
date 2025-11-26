import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface PeriodSelectorProps {
  selectedPeriod: Period;
  onSelect: (period: Period) => void;
  primaryColor: string;
}

const PERIODS: { value: Period; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

export const PeriodSelector = ({
  selectedPeriod,
  onSelect,
  primaryColor,
}: PeriodSelectorProps) => {
  return (
    <View className="flex-row gap-2">
      {PERIODS.map((period) => {
        const isSelected = selectedPeriod === period.value;
        return (
          <TouchableOpacity
            key={period.value}
            onPress={() => onSelect(period.value)}
            activeOpacity={0.7}
            className={`flex-1 py-3 rounded-xl items-center ${
              isSelected ? '' : 'bg-gray-100 dark:bg-slate-700'
            }`}
            style={isSelected ? { backgroundColor: primaryColor } : undefined}
          >
            <Text
              className={`font-medium text-sm ${
                isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {period.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

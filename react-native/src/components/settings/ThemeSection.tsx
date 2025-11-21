import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { Card } from '../Card';
import { Moon, Sun } from 'lucide-react-native';

interface ThemeSectionProps {
  theme: 'light' | 'dark';
  primaryColor: string;
  toggleTheme: () => void;
}

export const ThemeSection = ({ theme, primaryColor, toggleTheme }: ThemeSectionProps) => {
  return (
    <>
      <Text className="text-gray-900 dark:text-white text-lg font-bold mb-4">
        Appearance
      </Text>
      <Card className="mb-6">
        <TouchableOpacity
          className="p-4 flex-row items-center justify-between"
          onPress={toggleTheme}
        >
          <View className="flex-row items-center gap-3">
            <View
              className="w-10 h-10 rounded-xl items-center justify-center"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              {theme === 'light' ? (
                <Sun size={20} color={primaryColor} />
              ) : (
                <Moon size={20} color={primaryColor} />
              )}
            </View>
            <View>
              <Text className="text-gray-900 dark:text-white font-semibold">
                Dark Mode
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-xs">
                Toggle dark theme
              </Text>
            </View>
          </View>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: '#D1D5DB', true: primaryColor }}
            thumbColor="#FFFFFF"
          />
        </TouchableOpacity>
      </Card>
    </>
  );
};

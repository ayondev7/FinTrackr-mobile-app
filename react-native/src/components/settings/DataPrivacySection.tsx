import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card } from '../Card';
import { Download, Trash2, ChevronRight } from 'lucide-react-native';

interface DataPrivacySectionProps {
  primaryColor: string;
  dangerColor: string;
}

export const DataPrivacySection = ({ primaryColor, dangerColor }: DataPrivacySectionProps) => {
  return (
    <>
      <Text className="text-gray-900 dark:text-white text-lg font-bold mb-4">
        Data & Privacy
      </Text>
      <Card className="mb-6">
        <TouchableOpacity className="p-4 flex-row items-center justify-between border-b border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center gap-3">
            <View
              className="w-10 h-10 rounded-xl items-center justify-center"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <Download size={20} color={primaryColor} />
            </View>
            <View>
              <Text className="text-gray-900 dark:text-white font-semibold">
                Export Data
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-xs">
                Download as CSV
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity className="p-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View
              className="w-10 h-10 rounded-xl items-center justify-center"
              style={{ backgroundColor: `${dangerColor}20` }}
            >
              <Trash2 size={20} color={dangerColor} />
            </View>
            <View>
              <Text className="text-gray-900 dark:text-white font-semibold">
                Clear Data
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-xs">
                Reset all transactions
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </Card>
    </>
  );
};

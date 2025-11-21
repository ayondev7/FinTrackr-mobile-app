import React from 'react';
import { View, Text, Modal, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { X, Download, FileText, CheckCircle } from 'lucide-react-native';
import { Card } from '../shared/Card';

interface ExportModalProps {
  visible: boolean;
  onClose: () => void;
  primaryColor: string;
  onExport: (format: 'csv' | 'json' | 'pdf') => void;
}

export const ExportModal = ({ visible, onClose, primaryColor, onExport }: ExportModalProps) => {
  const exportOptions = [
    {
      format: 'csv' as const,
      title: 'CSV Format',
      description: 'Spreadsheet-friendly format',
      icon: FileText,
    },
    {
      format: 'json' as const,
      title: 'JSON Format',
      description: 'Developer-friendly format',
      icon: FileText,
    },
    {
      format: 'pdf' as const,
      title: 'PDF Report',
      description: 'Formatted document',
      icon: FileText,
    },
  ];

  const handleExport = (format: 'csv' | 'json' | 'pdf') => {
    onExport(format);
    Alert.alert(
      'Export Started',
      `Your data is being exported as ${format.toUpperCase()}. You'll be notified when ready.`,
      [{ text: 'OK', onPress: onClose }]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <View className="flex-1 mt-20 bg-gray-50 dark:bg-slate-900 rounded-t-3xl">
          <View className="flex-row items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <Text className="text-gray-900 dark:text-white text-xl font-bold">
              Export Data
            </Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <ScrollView className="flex-1 p-6">
            <View className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
              <View className="flex-row items-center gap-2 mb-2">
                <CheckCircle size={16} color="#3B82F6" />
                <Text className="text-blue-800 dark:text-blue-300 font-semibold">
                  What's included?
                </Text>
              </View>
              <Text className="text-blue-700 dark:text-blue-400 text-sm">
                • All transactions{'\n'}
                • Categories and budgets{'\n'}
                • Account balances{'\n'}
                • Analytics data
              </Text>
            </View>

            <Text className="text-gray-900 dark:text-white font-semibold mb-3">
              Choose Export Format
            </Text>

            {exportOptions.map((option) => {
              const Icon = option.icon;
              return (
                <TouchableOpacity
                  key={option.format}
                  onPress={() => handleExport(option.format)}
                  activeOpacity={0.7}
                >
                  <Card className="mb-3 p-4">
                    <View className="flex-row items-center gap-3">
                      <View
                        className="w-12 h-12 rounded-xl items-center justify-center"
                        style={{ backgroundColor: `${primaryColor}20` }}
                      >
                        <Icon size={24} color={primaryColor} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-gray-900 dark:text-white font-semibold mb-1">
                          {option.title}
                        </Text>
                        <Text className="text-gray-500 dark:text-gray-400 text-xs">
                          {option.description}
                        </Text>
                      </View>
                      <Download size={20} color="#9CA3AF" />
                    </View>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

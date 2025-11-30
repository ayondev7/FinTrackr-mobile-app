import React from 'react';
import { View, Text, Modal, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Trash2, AlertTriangle } from 'lucide-react-native';
import { Card } from '../shared/Card';

interface ClearDataModalProps {
  visible: boolean;
  onClose: () => void;
  dangerColor: string;
  onClearData: () => void;
  isLoading?: boolean;
}

export const ClearDataModal = ({ visible, onClose, dangerColor, onClearData, isLoading = false }: ClearDataModalProps) => {
  const insets = useSafeAreaInsets();

  const handleClear = () => {
    Alert.alert(
      'Clear All Data?',
      'This action cannot be undone. All your transactions, categories, budgets, and balances will be permanently deleted.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: onClearData,
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={isLoading ? undefined : onClose}
    >
      <View 
        className="flex-1 bg-black/70 items-center justify-center p-6"
        style={{ paddingLeft: Math.max(insets.left, 24), paddingRight: Math.max(insets.right, 24) }}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          showsVerticalScrollIndicator={false}
        >
          <Card className="w-full max-w-md p-6 self-center">
          <View className="items-center mb-6">
            <View
              className="w-16 h-16 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: `${dangerColor}20` }}
            >
              <AlertTriangle size={32} color={dangerColor} />
            </View>
            <Text className="text-gray-900 dark:text-white text-xl font-bold mb-2">
              Clear All Data?
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 text-center text-sm">
              This will permanently delete all your data including:
            </Text>
          </View>

          <View className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
            <Text className="text-red-700 dark:text-red-400 text-sm mb-2">
              ⚠️ Warning: This action is irreversible
            </Text>
            <Text className="text-red-600 dark:text-red-400 text-xs">
              • All transactions{'\n'}
              • Budget settings{'\n'}
              • Categories{'\n'}
              • Account balances will be reset to 0
            </Text>
          </View>

          <View className="gap-3">
            <TouchableOpacity
              className="p-4 rounded-2xl"
              style={{ backgroundColor: dangerColor, opacity: isLoading ? 0.7 : 1 }}
              onPress={handleClear}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <View className="flex-row items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text className="text-white font-semibold text-base">
                      Clearing Data...
                    </Text>
                  </>
                ) : (
                  <>
                    <Trash2 size={20} color="#FFFFFF" />
                    <Text className="text-white font-semibold text-base">
                      Clear All Data
                    </Text>
                  </>
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="p-4 rounded-2xl bg-gray-100 dark:bg-slate-800"
              onPress={onClose}
              activeOpacity={0.8}
              disabled={isLoading}
              style={{ opacity: isLoading ? 0.5 : 1 }}
            >
              <Text className="text-gray-900 dark:text-white font-semibold text-base text-center">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
          </Card>
        </ScrollView>
      </View>
    </Modal>
  );
};

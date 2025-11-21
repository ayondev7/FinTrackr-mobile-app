import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { X, Check } from 'lucide-react-native';
import { Card } from '../shared/Card';
import { CURRENCIES } from '../../constants';

interface CurrencyModalProps {
  visible: boolean;
  onClose: () => void;
  selectedCurrency: string;
  onSelect: (currency: string) => void;
}

export const CurrencyModal = ({ visible, onClose, selectedCurrency, onSelect }: CurrencyModalProps) => {
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
              Select Currency
            </Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <ScrollView className="flex-1 p-6">
            {CURRENCIES.map((currency) => (
              <TouchableOpacity
                key={currency.code}
                onPress={() => {
                  onSelect(currency.code);
                  onClose();
                }}
                activeOpacity={0.7}
              >
                <Card className="mb-3 p-4">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                      <View className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 items-center justify-center">
                        <Text className="text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                          {currency.symbol}
                        </Text>
                      </View>
                      <View>
                        <Text className="text-gray-900 dark:text-white font-semibold">
                          {currency.code}
                        </Text>
                        <Text className="text-gray-500 dark:text-gray-400 text-sm">
                          {currency.name}
                        </Text>
                      </View>
                    </View>
                    {selectedCurrency === currency.code && (
                      <Check size={24} color="#10B981" />
                    )}
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

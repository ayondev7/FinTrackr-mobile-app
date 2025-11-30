import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Banknote, Building2, Smartphone, AlertTriangle, Save } from 'lucide-react-native';
import { Card } from '../shared/Card';

interface AccountBalancesModalProps {
  visible: boolean;
  onClose: () => void;
  cashBalance: number;
  bankBalance: number;
  digitalBalance: number;
  currencySymbol: string;
  onUpdate: (cash: number, bank: number, digital: number) => Promise<void>;
  isLoading?: boolean;
}

export const AccountBalancesModal = ({
  visible,
  onClose,
  cashBalance,
  bankBalance,
  digitalBalance,
  currencySymbol,
  onUpdate,
  isLoading = false,
}: AccountBalancesModalProps) => {
  const insets = useSafeAreaInsets();
  const [cash, setCash] = useState('');
  const [bank, setBank] = useState('');
  const [digital, setDigital] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setCash(cashBalance.toString());
      setBank(bankBalance.toString());
      setDigital(digitalBalance.toString());
    }
  }, [visible, cashBalance, bankBalance, digitalBalance]);

  const sanitizeDecimalInput = useCallback((text: string): string => {
    const cleaned = text.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    if (parts[1] && parts[1].length > 2) {
      return parts[0] + '.' + parts[1].slice(0, 2);
    }
    return cleaned;
  }, []);

  const currentTotal = useMemo(() => cashBalance + bankBalance + digitalBalance, [cashBalance, bankBalance, digitalBalance]);

  const newTotal = useMemo(() => {
    const cashNum = parseFloat(cash) || 0;
    const bankNum = parseFloat(bank) || 0;
    const digitalNum = parseFloat(digital) || 0;
    return cashNum + bankNum + digitalNum;
  }, [cash, bank, digital]);

  const difference = useMemo(() => newTotal - currentTotal, [newTotal, currentTotal]);

  const hasChanges = useMemo(() => {
    const cashNum = parseFloat(cash) || 0;
    const bankNum = parseFloat(bank) || 0;
    const digitalNum = parseFloat(digital) || 0;
    return (
      cashNum !== cashBalance ||
      bankNum !== bankBalance ||
      digitalNum !== digitalBalance
    );
  }, [cash, bank, digital, cashBalance, bankBalance, digitalBalance]);

  const handleUpdate = () => {
    Alert.alert(
      'Update Account Balances?',
      'Changing your account balances will affect how your financial summary and reports are calculated. Your past transactions will remain unchanged, but the current balance displayed may differ from the calculated balance based on your transaction history.\n\nAre you sure you want to proceed?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Update Balances',
          style: 'default',
          onPress: async () => {
            const cashNum = parseFloat(cash) || 0;
            const bankNum = parseFloat(bank) || 0;
            const digitalNum = parseFloat(digital) || 0;
            await onUpdate(cashNum, bankNum, digitalNum);
          },
        },
      ]
    );
  };

  const handleClose = () => {
    if (hasChanges && !isLoading) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to close without saving?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: onClose },
        ]
      );
    } else {
      onClose();
    }
  };

  const formatAmount = (amount: number) => {
    return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={isLoading ? undefined : handleClose}
    >
      <View className="flex-1 bg-black/50">
        <View 
          className="flex-1 mt-16 bg-gray-50 dark:bg-slate-900 rounded-t-3xl"
          style={{ marginLeft: insets.left, marginRight: insets.right }}
        >
          <View className="flex-row items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <Text className="text-gray-900 dark:text-white text-xl font-bold">
              Edit Account Balances
            </Text>
            <TouchableOpacity 
              onPress={handleClose} 
              className="p-2"
              disabled={isLoading}
            >
              <X size={24} color={isLoading ? '#9CA3AF' : '#6B7280'} />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-6" contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 100) }}>
            <View className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex-row items-start gap-3">
              <AlertTriangle size={20} color="#F59E0B" />
              <View className="flex-1">
                <Text className="text-amber-800 dark:text-amber-400 font-semibold text-sm mb-1">
                  Important Notice
                </Text>
                <Text className="text-amber-700 dark:text-amber-400 text-xs leading-5">
                  Modifying your account balances will update your current financial snapshot. Past transactions will not be affected, but your displayed balance may differ from calculated totals.
                </Text>
              </View>
            </View>

            <Card className="mb-4 p-0">
              <View className="p-4 border-b border-gray-100 dark:border-gray-700">
                <View className="flex-row items-center gap-3 mb-3">
                  <View className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 items-center justify-center">
                    <Banknote size={20} color="#10B981" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 dark:text-white font-semibold">
                      Cash Balance
                    </Text>
                    <Text className="text-gray-500 dark:text-gray-400 text-xs">
                      Current: {currencySymbol}{formatAmount(cashBalance)}
                    </Text>
                  </View>
                </View>
                <View
                  className={`flex-row items-center rounded-xl border-2 px-4 py-3 ${
                    focusedInput === 'cash'
                      ? 'border-indigo-500 bg-white dark:bg-slate-800'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800/50'
                  }`}
                >
                  <Text className="text-indigo-600 dark:text-indigo-400 text-lg font-bold mr-2">
                    {currencySymbol}
                  </Text>
                  <TextInput
                    className="flex-1 text-lg font-semibold text-gray-900 dark:text-white"
                    placeholder="0.00"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="decimal-pad"
                    value={cash}
                    onChangeText={(text) => setCash(sanitizeDecimalInput(text))}
                    onFocus={() => setFocusedInput('cash')}
                    onBlur={() => setFocusedInput(null)}
                    editable={!isLoading}
                  />
                </View>
              </View>

              <View className="p-4 border-b border-gray-100 dark:border-gray-700">
                <View className="flex-row items-center gap-3 mb-3">
                  <View className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 items-center justify-center">
                    <Building2 size={20} color="#3B82F6" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 dark:text-white font-semibold">
                      Bank Balance
                    </Text>
                    <Text className="text-gray-500 dark:text-gray-400 text-xs">
                      Current: {currencySymbol}{formatAmount(bankBalance)}
                    </Text>
                  </View>
                </View>
                <View
                  className={`flex-row items-center rounded-xl border-2 px-4 py-3 ${
                    focusedInput === 'bank'
                      ? 'border-indigo-500 bg-white dark:bg-slate-800'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800/50'
                  }`}
                >
                  <Text className="text-indigo-600 dark:text-indigo-400 text-lg font-bold mr-2">
                    {currencySymbol}
                  </Text>
                  <TextInput
                    className="flex-1 text-lg font-semibold text-gray-900 dark:text-white"
                    placeholder="0.00"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="decimal-pad"
                    value={bank}
                    onChangeText={(text) => setBank(sanitizeDecimalInput(text))}
                    onFocus={() => setFocusedInput('bank')}
                    onBlur={() => setFocusedInput(null)}
                    editable={!isLoading}
                  />
                </View>
              </View>

              <View className="p-4">
                <View className="flex-row items-center gap-3 mb-3">
                  <View className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 items-center justify-center">
                    <Smartphone size={20} color="#8B5CF6" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 dark:text-white font-semibold">
                      Digital Wallet
                    </Text>
                    <Text className="text-gray-500 dark:text-gray-400 text-xs">
                      Current: {currencySymbol}{formatAmount(digitalBalance)}
                    </Text>
                  </View>
                </View>
                <View
                  className={`flex-row items-center rounded-xl border-2 px-4 py-3 ${
                    focusedInput === 'digital'
                      ? 'border-indigo-500 bg-white dark:bg-slate-800'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800/50'
                  }`}
                >
                  <Text className="text-indigo-600 dark:text-indigo-400 text-lg font-bold mr-2">
                    {currencySymbol}
                  </Text>
                  <TextInput
                    className="flex-1 text-lg font-semibold text-gray-900 dark:text-white"
                    placeholder="0.00"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="decimal-pad"
                    value={digital}
                    onChangeText={(text) => setDigital(sanitizeDecimalInput(text))}
                    onFocus={() => setFocusedInput('digital')}
                    onBlur={() => setFocusedInput(null)}
                    editable={!isLoading}
                  />
                </View>
              </View>
            </Card>

            <Card className="mb-6">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-gray-600 dark:text-gray-400 text-sm">Current Total</Text>
                <Text className="text-gray-900 dark:text-white font-semibold">
                  {currencySymbol}{formatAmount(currentTotal)}
                </Text>
              </View>
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-gray-600 dark:text-gray-400 text-sm">New Total</Text>
                <Text className="text-gray-900 dark:text-white font-bold text-lg">
                  {currencySymbol}{formatAmount(newTotal)}
                </Text>
              </View>
              {hasChanges && (
                <View className="flex-row items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                  <Text className="text-gray-600 dark:text-gray-400 text-sm">Difference</Text>
                  <Text
                    className={`font-bold ${
                      difference >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {difference >= 0 ? '+' : ''}{currencySymbol}{formatAmount(difference)}
                  </Text>
                </View>
              )}
            </Card>

            <TouchableOpacity
              className={`flex-row items-center justify-center rounded-2xl py-4 ${
                !hasChanges || isLoading ? 'bg-gray-400' : 'bg-indigo-600'
              }`}
              onPress={handleUpdate}
              activeOpacity={0.8}
              disabled={!hasChanges || isLoading}
            >
              {isLoading ? (
                <>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text className="text-white font-bold text-base ml-2">
                    Updating...
                  </Text>
                </>
              ) : (
                <>
                  <Save size={20} color="#FFFFFF" />
                  <Text className="text-white font-bold text-base ml-2">
                    Update Balances
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="items-center justify-center mt-4"
              onPress={handleClose}
              disabled={isLoading}
            >
              <Text className={`font-semibold ${isLoading ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'}`}>
                Cancel
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

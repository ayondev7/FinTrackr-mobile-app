

















































































































































































































































































































































































































































import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOnboardingStore } from '../store/onboardingStore';
import { useToastStore } from '../store/toastStore';
import { useUpdateBalance } from '../hooks';

const { width } = Dimensions.get('window');

export const BalanceSetupScreen: React.FC = () => {
  const [balance, setBalance] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { setHasSetupBalance } = useOnboardingStore();
  const { showSuccess, showError } = useToastStore();
  const updateBalance = useUpdateBalance();

  const handleBalanceChange = (text: string) => {
    const cleaned = text.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      return;
    }
    if (parts[1] && parts[1].length > 2) {
      return;
    }
    setBalance(cleaned);
  };

  const handleContinue = async () => {
    const numericBalance = parseFloat(balance);

    if (isNaN(numericBalance) || numericBalance < 0) {
      showError('Invalid Amount', 'Please enter a valid balance amount');
      return;
    }

    try {
      await updateBalance.mutateAsync({
        initialBalance: numericBalance,
        currentBalance: numericBalance,
      });

      showSuccess('Balance Set!', 'Your initial balance has been saved');
      setHasSetupBalance(true);
    } catch (error) {
      showError('Error', 'Failed to save your balance. Please try again.');
    }
  };

  const isValidAmount = balance.length > 0 && !isNaN(parseFloat(balance)) && parseFloat(balance) >= 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <View className="flex-1 px-8 pt-16">
        <View className="items-center mb-8">
          <View style={styles.iconContainer}>
            <Ionicons name="wallet-outline" size={48} color="#4F46E5" />
          </View>
        </View>

        <View className="items-center mb-8">
          <Text className="text-3xl font-bold text-gray-900 text-center mb-3">
            Let's Set Up Your{'\n'}
            <Text className="text-indigo-600">Starting Balance</Text>
          </Text>
          <Text className="text-base text-gray-500 text-center leading-6 px-4">
            Enter your current account balance to start tracking your finances accurately.
          </Text>
        </View>

        <View className="mb-8">
          <Image
            source={{ uri: 'https://ik.imagekit.io/swiftChat/fintrackr/balance-setup.webp' }}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Your Current Balance
          </Text>
          <View
            style={[
              styles.inputContainer,
              isFocused && styles.inputContainerFocused,
            ]}
          >
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor="#9CA3AF"
              keyboardType="decimal-pad"
              value={balance}
              onChangeText={handleBalanceChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </View>
          <Text className="text-xs text-gray-400 mt-2">
            This will be your starting point for expense tracking
          </Text>
        </View>

        <View className="mb-8">
          <View className="flex-row items-center mb-3">
            <View className="w-8 h-8 rounded-full bg-indigo-100 items-center justify-center mr-3">
              <Ionicons name="checkmark" size={18} color="#4F46E5" />
            </View>
            <Text className="text-gray-600 flex-1">Track every transaction with precision</Text>
          </View>
          <View className="flex-row items-center mb-3">
            <View className="w-8 h-8 rounded-full bg-indigo-100 items-center justify-center mr-3">
              <Ionicons name="checkmark" size={18} color="#4F46E5" />
            </View>
            <Text className="text-gray-600 flex-1">Get insights on your spending habits</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-indigo-100 items-center justify-center mr-3">
              <Ionicons name="checkmark" size={18} color="#4F46E5" />
            </View>
            <Text className="text-gray-600 flex-1">Set budgets and achieve financial goals</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleContinue}
          disabled={!isValidAmount || updateBalance.isPending}
          style={[
            styles.continueButton,
            (!isValidAmount || updateBalance.isPending) && styles.continueButtonDisabled,
          ]}
          activeOpacity={0.8}
        >
          {updateBalance.isPending ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.continueButtonText}>Continue to Dashboard</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setBalance('0');
            handleContinue();
          }}
          disabled={updateBalance.isPending}
          style={styles.skipButton}
        >
          <Text style={styles.skipButtonText}>Start with $0</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  illustration: {
    width: width * 0.6,
    height: width * 0.4,
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  inputContainerFocused: {
    borderColor: '#4F46E5',
    backgroundColor: '#FFFFFF',
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4F46E5',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
  },
  continueButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 8,
  },
  skipButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 12,
  },
  skipButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
});

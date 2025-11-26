import React, { useState } from "react";
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
  Modal,
  FlatList,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useOnboardingStore } from "../store/onboardingStore";
import { useToastStore } from "../store/toastStore";
import { useUpdateBalance } from "../hooks";
import { CURRENCIES } from "../constants";

const { width } = Dimensions.get("window");

export const BalanceSetupScreen: React.FC = () => {
  const [step, setStep] = useState<'total' | 'distribution'>('total');
  const [balance, setBalance] = useState("");
  const [cashBalance, setCashBalance] = useState("");
  const [bankBalance, setBankBalance] = useState("");
  const [digitalBalance, setDigitalBalance] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0]);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const { setHasSetupBalance } = useOnboardingStore();
  const { showSuccess, showError } = useToastStore();
  const updateBalance = useUpdateBalance();

  const handleBalanceChange = (text: string) => {
    const cleaned = text.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      return;
    }
    if (parts[1] && parts[1].length > 2) {
      return;
    }
    setBalance(cleaned);
  };

  const handleDistributionChange = (text: string, type: 'cash' | 'bank' | 'digital') => {
    const cleaned = text.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;

    if (type === 'cash') setCashBalance(cleaned);
    else if (type === 'bank') setBankBalance(cleaned);
    else setDigitalBalance(cleaned);
  };

  const handleContinue = async () => {
    if (step === 'total') {
      const numericBalance = parseFloat(balance);
      if (isNaN(numericBalance) || numericBalance < 0) {
        showError("Invalid Amount", "Please enter a valid balance amount");
        return;
      }
      if (numericBalance === 0) {
        // Skip distribution if 0
        await submitBalances(0, 0, 0);
      } else {
        setStep('distribution');
      }
    } else {
      // Validate distribution sums up to total
      const cash = parseFloat(cashBalance) || 0;
      const bank = parseFloat(bankBalance) || 0;
      const digital = parseFloat(digitalBalance) || 0;
      const total = parseFloat(balance);

      if (Math.abs(cash + bank + digital - total) > 0.01) {
        showError("Mismatch", `Total distribution (${cash + bank + digital}) must match total balance (${total})`);
        return;
      }
      await submitBalances(cash, bank, digital);
    }
  };

  const submitBalances = async (cash: number, bank: number, digital: number) => {
    try {
      await updateBalance.mutateAsync({
        cashBalance: cash,
        bankBalance: bank,
        digitalBalance: digital,
        currency: selectedCurrency.code,
      });

      showSuccess("Balance Set!", "Your initial balance has been saved");
      setHasSetupBalance(true);
    } catch (error) {
      showError("Error", "Failed to save your balance. Please try again.");
    }
  };

  const isValidAmount =
    balance.length > 0 &&
    !isNaN(parseFloat(balance)) &&
    parseFloat(balance) >= 0;

  if (step === 'distribution') {
    const total = parseFloat(balance);
    const currentSum = (parseFloat(cashBalance) || 0) + (parseFloat(bankBalance) || 0) + (parseFloat(digitalBalance) || 0);
    const remaining = total - currentSum;

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-white"
      >
        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 px-8 pt-16">
            <View className="items-center mb-6">
              <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
                Distribute Your Balance
              </Text>
              <Text className="text-base text-gray-500 text-center">
                Total: {selectedCurrency.symbol}{balance}
              </Text>
              <Text className={`text-sm font-semibold mt-2 ${remaining < 0 ? 'text-red-500' : 'text-indigo-600'}`}>
                Remaining: {selectedCurrency.symbol}{remaining.toFixed(2)}
              </Text>
            </View>

            {/* Cash Input */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Cash</Text>
              <View style={[styles.inputContainer, focusedInput === 'cash' && styles.inputContainerFocused]}>
                <Text style={styles.currencySymbol}>{selectedCurrency.symbol}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="decimal-pad"
                  value={cashBalance}
                  onChangeText={(t) => handleDistributionChange(t, 'cash')}
                  onFocus={() => setFocusedInput('cash')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* Bank Input */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Bank Account</Text>
              <View style={[styles.inputContainer, focusedInput === 'bank' && styles.inputContainerFocused]}>
                <Text style={styles.currencySymbol}>{selectedCurrency.symbol}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="decimal-pad"
                  value={bankBalance}
                  onChangeText={(t) => handleDistributionChange(t, 'bank')}
                  onFocus={() => setFocusedInput('bank')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* Digital Input */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Digital Banking (Bkash, Nagad, etc.)</Text>
              <View style={[styles.inputContainer, focusedInput === 'digital' && styles.inputContainerFocused]}>
                <Text style={styles.currencySymbol}>{selectedCurrency.symbol}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="decimal-pad"
                  value={digitalBalance}
                  onChangeText={(t) => handleDistributionChange(t, 'digital')}
                  onFocus={() => setFocusedInput('digital')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleContinue}
              disabled={Math.abs(remaining) > 0.01 || updateBalance.isPending}
              className={`flex-row items-center justify-center rounded-2xl py-4 px-6 ${
                Math.abs(remaining) > 0.01 || updateBalance.isPending
                  ? "bg-gray-400"
                  : "bg-indigo-600"
              }`}
              activeOpacity={0.8}
            >
              {updateBalance.isPending ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text className="text-lg font-bold text-white mr-2">
                    Complete Setup
                  </Text>
                  <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setStep('total')}
              className="items-center justify-center mt-4"
            >
              <Text className="text-indigo-600 font-semibold">Back to Total</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-8 pt-16">
          <View className="items-center mb-8">
            <View style={styles.iconContainer}>
              <Ionicons name="wallet-outline" size={48} color="#4F46E5" />
            </View>
          </View>

          <View className="items-center mb-8">
            <Text className="text-3xl font-bold text-gray-900 text-center mb-3">
              Let's Set Up Your{"\n"}
              <Text className="text-indigo-600">Starting Balance</Text>
            </Text>
            <Text className="text-base text-gray-500 text-center leading-6 px-4">
              Enter your current account balance to start tracking your finances
              accurately.
            </Text>
          </View>

          {/* Currency Selector */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Select Currency
            </Text>
            <TouchableOpacity
              onPress={() => setShowCurrencyModal(true)}
              style={styles.currencySelector}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <Text style={styles.currencySelectorSymbol}>
                  {selectedCurrency.symbol}
                </Text>
                <View className="ml-3">
                  <Text className="text-base font-semibold text-gray-900">
                    {selectedCurrency.code}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {selectedCurrency.name}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-down" size={20} color="#6B7280" />
            </TouchableOpacity>
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
              <Text style={styles.currencySymbol}>{selectedCurrency.symbol}</Text>
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
              <Text className="text-gray-600 flex-1">
                Track every transaction with precision
              </Text>
            </View>
            <View className="flex-row items-center mb-3">
              <View className="w-8 h-8 rounded-full bg-indigo-100 items-center justify-center mr-3">
                <Ionicons name="checkmark" size={18} color="#4F46E5" />
              </View>
              <Text className="text-gray-600 flex-1">
                Get insights on your spending habits
              </Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-indigo-100 items-center justify-center mr-3">
                <Ionicons name="checkmark" size={18} color="#4F46E5" />
              </View>
              <Text className="text-gray-600 flex-1">
                Set budgets and achieve financial goals
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleContinue}
            disabled={!isValidAmount || updateBalance.isPending}
            className={`flex-row items-center justify-center rounded-2xl py-4 px-6 ${
              !isValidAmount || updateBalance.isPending
                ? "bg-gray-400"
                : "bg-indigo-600"
            }`}
            activeOpacity={0.8}
          >
            {updateBalance.isPending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text className="text-lg font-bold text-white mr-2">
                  Continue
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setBalance("0");
              submitBalances(0, 0, 0);
            }}
            disabled={updateBalance.isPending}
            className="items-center justify-center mt-5"
          >
            <Text className="text-base font-semibold text-gray-600">
              Start with {selectedCurrency.symbol}0
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Currency Selection Modal */}
      <Modal
        visible={showCurrencyModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCurrencyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Currency</Text>
              <TouchableOpacity
                onPress={() => setShowCurrencyModal(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={CURRENCIES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.currencyItem,
                    selectedCurrency.code === item.code &&
                      styles.currencyItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedCurrency(item);
                    setShowCurrencyModal(false);
                  }}
                >
                  <View className="flex-row items-center flex-1">
                    <Text style={styles.currencyItemSymbol}>{item.symbol}</Text>
                    <View className="ml-3">
                      <Text style={styles.currencyItemCode}>{item.code}</Text>
                      <Text style={styles.currencyItemName}>{item.name}</Text>
                    </View>
                  </View>
                  {selectedCurrency.code === item.code && (
                    <Ionicons name="checkmark-circle" size={24} color="#4F46E5" />
                  )}
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  illustration: {
    width: width * 0.6,
    height: width * 0.4,
    alignSelf: "center",
  },
  currencySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  currencySelectorSymbol: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4F46E5",
    width: 32,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  inputContainerFocused: {
    borderColor: "#4F46E5",
    backgroundColor: "#FFFFFF",
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4F46E5",
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: "600",
    color: "#1F2937",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "70%",
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  currencyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  currencyItemSelected: {
    backgroundColor: "#EEF2FF",
  },
  currencyItemSymbol: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4F46E5",
    width: 32,
    textAlign: "center",
  },
  currencyItemCode: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  currencyItemName: {
    fontSize: 12,
    color: "#6B7280",
  },
});

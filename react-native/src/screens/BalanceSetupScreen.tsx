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
  const [balance, setBalance] = useState("");
  const [isFocused, setIsFocused] = useState(false);
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

  const handleContinue = async () => {
    const numericBalance = parseFloat(balance);

    if (isNaN(numericBalance) || numericBalance < 0) {
      showError("Invalid Amount", "Please enter a valid balance amount");
      return;
    }

    try {
      await updateBalance.mutateAsync({
        initialBalance: numericBalance,
        currentBalance: numericBalance,
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
                  Save & Continue
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setBalance("0");
              handleContinue();
            }}
            disabled={updateBalance.isPending}
            className="items-center justify-center py-4 mt-3 border-2 border-gray-200 rounded-2xl"
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

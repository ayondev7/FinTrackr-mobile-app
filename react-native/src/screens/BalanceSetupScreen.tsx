import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
  Modal,
  FlatList,
  ScrollView,
  Keyboard,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Banknote, Building2, Smartphone, PieChart, CheckCircle2 } from "lucide-react-native";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useOnboardingStore } from "../store/onboardingStore";
import { useToastStore } from "../store/toastStore";
import { useUpdateBalance } from "../hooks";
import { CURRENCIES } from "../constants";

const { width } = Dimensions.get("window");

// Schema for the total balance step
const totalBalanceSchema = z.object({
  balance: z.string()
    .refine((val) => val === "" || val === "0" || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0), {
      message: "Please enter a valid balance amount",
    }),
  currency: z.object({
    code: z.string(),
    symbol: z.string(),
    name: z.string(),
  }),
});

// Schema for the distribution step with custom refinement
const distributionSchema = z.object({
  cashBalance: z.string()
    .refine((val) => val === "" || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0), {
      message: "Please enter a valid cash amount",
    }),
  bankBalance: z.string()
    .refine((val) => val === "" || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0), {
      message: "Please enter a valid bank amount",
    }),
  digitalBalance: z.string()
    .refine((val) => val === "" || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0), {
      message: "Please enter a valid digital wallet amount",
    }),
});

type TotalBalanceFormData = z.infer<typeof totalBalanceSchema>;
type DistributionFormData = z.infer<typeof distributionSchema>;

export const BalanceSetupScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<'total' | 'distribution'>('total');
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const { setHasSetupBalance } = useOnboardingStore();
  const { showSuccess, showError } = useToastStore();
  const updateBalance = useUpdateBalance();

  // Form for total balance step
  const totalForm = useForm<TotalBalanceFormData>({
    resolver: zodResolver(totalBalanceSchema),
    defaultValues: {
      balance: "",
      currency: CURRENCIES[0],
    },
    mode: "onChange",
  });

  // Form for distribution step
  const distributionForm = useForm<DistributionFormData>({
    resolver: zodResolver(distributionSchema),
    defaultValues: {
      cashBalance: "",
      bankBalance: "",
      digitalBalance: "",
    },
    mode: "onChange",
  });

  // Watch distribution values
  const cashValue = useWatch({ control: distributionForm.control, name: "cashBalance" });
  const bankValue = useWatch({ control: distributionForm.control, name: "bankBalance" });
  const digitalValue = useWatch({ control: distributionForm.control, name: "digitalBalance" });
  const selectedCurrency = useWatch({ control: totalForm.control, name: "currency" });
  const balanceValue = useWatch({ control: totalForm.control, name: "balance" });

  // Calculate distribution totals
  const distributionTotal = useMemo(() => {
    const cash = parseFloat(cashValue) || 0;
    const bank = parseFloat(bankValue) || 0;
    const digital = parseFloat(digitalValue) || 0;
    return cash + bank + digital;
  }, [cashValue, bankValue, digitalValue]);

  const remaining = useMemo(() => totalBalance - distributionTotal, [totalBalance, distributionTotal]);
  const isDistributionComplete = useMemo(() => Math.abs(remaining) <= 0.01, [remaining]);
  const isOverDistributed = useMemo(() => remaining < -0.01, [remaining]);

  // Custom distribution validation error message
  const distributionError = useMemo(() => {
    if (isOverDistributed) {
      return `Distribution exceeds total by ${selectedCurrency.symbol}${Math.abs(remaining).toFixed(2)}`;
    }
    if (!isDistributionComplete && distributionTotal > 0) {
      return `${selectedCurrency.symbol}${remaining.toFixed(2)} remaining to distribute`;
    }
    return null;
  }, [isOverDistributed, isDistributionComplete, distributionTotal, remaining, selectedCurrency.symbol]);

  // Helper to sanitize decimal input
  const sanitizeDecimalInput = useCallback((text: string): string => {
    const cleaned = text.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      return parts[0] + "." + parts.slice(1).join("");
    }
    if (parts[1] && parts[1].length > 2) {
      return parts[0] + "." + parts[1].slice(0, 2);
    }
    return cleaned;
  }, []);

  // Handle total balance form submission
  const handleTotalBalanceSubmit = useCallback(async (data: TotalBalanceFormData) => {
    Keyboard.dismiss();
    const numericBalance = parseFloat(data.balance) || 0;
    
    if (numericBalance === 0) {
      // Skip distribution if balance is 0
      await submitBalances(0, 0, 0, data.currency.code);
    } else {
      setTotalBalance(numericBalance);
      // Reset distribution form when moving to distribution step
      distributionForm.reset({
        cashBalance: "",
        bankBalance: "",
        digitalBalance: "",
      });
      setStep('distribution');
    }
  }, []);

  // Handle distribution form submission
  const handleDistributionSubmit = useCallback(async () => {
    Keyboard.dismiss();
    
    if (!isDistributionComplete) {
      if (isOverDistributed) {
        showError("Over-distributed", `Your distribution exceeds the total balance by ${selectedCurrency.symbol}${Math.abs(remaining).toFixed(2)}`);
      } else {
        showError("Incomplete Distribution", `Please distribute the remaining ${selectedCurrency.symbol}${remaining.toFixed(2)}`);
      }
      return;
    }

    const cash = parseFloat(cashValue) || 0;
    const bank = parseFloat(bankValue) || 0;
    const digital = parseFloat(digitalValue) || 0;

    await submitBalances(cash, bank, digital, selectedCurrency.code);
  }, [isDistributionComplete, isOverDistributed, remaining, cashValue, bankValue, digitalValue, selectedCurrency]);

  const submitBalances = async (cash: number, bank: number, digital: number, currencyCode: string) => {
    try {
      await updateBalance.mutateAsync({
        cashBalance: cash,
        bankBalance: bank,
        digitalBalance: digital,
        currency: currencyCode,
      });

      showSuccess("Balance Set!", "Your initial balance has been saved");
      setHasSetupBalance(true);
    } catch (error) {
      showError("Error", "Failed to save your balance. Please try again.");
    }
  };

  // Check if total balance form is valid
  const isTotalFormValid = useMemo(() => {
    const balance = totalForm.watch("balance");
    return balance === "" || balance === "0" || (!isNaN(parseFloat(balance)) && parseFloat(balance) >= 0);
  }, [balanceValue]);

  // Handle going back to total step
  const handleBackToTotal = useCallback(() => {
    setStep('total');
    setTotalBalance(0);
  }, []);

  if (step === 'distribution') {
    // Calculate percentages for the visual bar
    const cashPercent = totalBalance > 0 ? ((parseFloat(cashValue) || 0) / totalBalance) * 100 : 0;
    const bankPercent = totalBalance > 0 ? ((parseFloat(bankValue) || 0) / totalBalance) * 100 : 0;
    const digitalPercent = totalBalance > 0 ? ((parseFloat(digitalValue) || 0) / totalBalance) * 100 : 0;
    const remainingPercent = totalBalance > 0 ? Math.max(0, (remaining / totalBalance) * 100) : 100;

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-white"
      >
        <ScrollView 
          className="flex-1" 
          contentContainerStyle={{ flexGrow: 1, paddingLeft: Math.max(insets.left, 24), paddingRight: Math.max(insets.right, 24), paddingTop: Math.max(insets.top, 48), paddingBottom: Math.max(insets.bottom, 24) }} 
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1">
            {/* Header with Icon */}
            <View className="items-center mb-6">
              <View style={styles.distributionIconContainer}>
                <PieChart size={40} color="#4F46E5" />
              </View>
              <Text className="text-2xl font-bold text-gray-900 text-center mb-2 mt-4">
                Balance Breakdown
              </Text>
              <Text className="text-base text-gray-500 text-center px-4 leading-6">
                Tell us how your {selectedCurrency.symbol}{totalBalance.toFixed(2)} is distributed across your accounts for accurate tracking
              </Text>
            </View>

            {/* Distribution Progress Bar */}
            <View className="mb-6 px-2">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm font-semibold text-gray-700">Distribution Progress</Text>
                <Text className={`text-sm font-bold ${isDistributionComplete ? 'text-green-600' : isOverDistributed ? 'text-red-500' : 'text-indigo-600'}`}>
                  {isDistributionComplete ? '✓ Complete!' : `${selectedCurrency.symbol}${Math.abs(remaining).toFixed(2)} ${isOverDistributed ? 'over' : 'remaining'}`}
                </Text>
              </View>
              <View style={styles.progressBarContainer}>
                {cashPercent > 0 && (
                  <View style={[styles.progressSegment, { width: `${Math.min(cashPercent, 100)}%`, backgroundColor: '#10B981' }]} />
                )}
                {bankPercent > 0 && (
                  <View style={[styles.progressSegment, { width: `${Math.min(bankPercent, 100 - cashPercent)}%`, backgroundColor: '#3B82F6' }]} />
                )}
                {digitalPercent > 0 && (
                  <View style={[styles.progressSegment, { width: `${Math.min(digitalPercent, 100 - cashPercent - bankPercent)}%`, backgroundColor: '#8B5CF6' }]} />
                )}
                {remainingPercent > 0 && !isOverDistributed && (
                  <View style={[styles.progressSegment, { width: `${remainingPercent}%`, backgroundColor: '#E5E7EB' }]} />
                )}
              </View>
              {/* Legend */}
              <View className="flex-row flex-wrap justify-center mt-3 gap-4">
                <View className="flex-row items-center">
                  <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
                  <Text className="text-xs text-gray-600">Cash</Text>
                </View>
                <View className="flex-row items-center">
                  <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
                  <Text className="text-xs text-gray-600">Bank</Text>
                </View>
                <View className="flex-row items-center">
                  <View style={[styles.legendDot, { backgroundColor: '#8B5CF6' }]} />
                  <Text className="text-xs text-gray-600">Digital</Text>
                </View>
              </View>
            </View>

            {/* Distribution Error Message */}
            {distributionError && distributionTotal > 0 && (
              <View className={`mb-4 p-3 rounded-xl flex-row items-center ${isOverDistributed ? 'bg-red-50' : 'bg-amber-50'}`}>
                <Ionicons 
                  name={isOverDistributed ? "alert-circle" : "information-circle"} 
                  size={20} 
                  color={isOverDistributed ? "#EF4444" : "#F59E0B"} 
                />
                <Text className={`ml-2 text-sm flex-1 ${isOverDistributed ? 'text-red-700' : 'text-amber-700'}`}>
                  {distributionError}
                </Text>
              </View>
            )}

            {/* Cash Input */}
            <View className="mb-4">
              <View className="flex-row items-center mb-2">
                <View style={[styles.inputIcon, { backgroundColor: '#D1FAE5' }]}>
                  <Banknote size={18} color="#10B981" />
                </View>
                <Text className="text-sm font-semibold text-gray-700 ml-2">Cash in Hand</Text>
              </View>
              <Controller
                control={distributionForm.control}
                name="cashBalance"
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <View>
                    <View style={[
                      styles.distributionInputContainer, 
                      focusedInput === 'cash' && styles.distributionInputFocused,
                      error && styles.distributionInputError
                    ]}>
                      <Text style={styles.distributionCurrencySymbol}>{selectedCurrency.symbol}</Text>
                      <TextInput
                        style={styles.distributionInput}
                        placeholder="0.00"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="decimal-pad"
                        value={value}
                        onChangeText={(text) => onChange(sanitizeDecimalInput(text))}
                        onFocus={() => setFocusedInput('cash')}
                        onBlur={() => {
                          setFocusedInput(null);
                          onBlur();
                        }}
                        editable={!updateBalance.isPending}
                      />
                      {parseFloat(value) > 0 && (
                        <View style={[styles.percentBadge, { backgroundColor: '#D1FAE5' }]}>
                          <Text style={[styles.percentText, { color: '#10B981' }]}>{cashPercent.toFixed(0)}%</Text>
                        </View>
                      )}
                    </View>
                    {error && (
                      <Text className="text-red-500 text-xs mt-1 ml-1">{error.message}</Text>
                    )}
                  </View>
                )}
              />
              <Text className="text-xs text-gray-400 mt-1 ml-1">Physical money in your wallet or at home</Text>
            </View>

            {/* Bank Input */}
            <View className="mb-4">
              <View className="flex-row items-center mb-2">
                <View style={[styles.inputIcon, { backgroundColor: '#DBEAFE' }]}>
                  <Building2 size={18} color="#3B82F6" />
                </View>
                <Text className="text-sm font-semibold text-gray-700 ml-2">Bank Account</Text>
              </View>
              <Controller
                control={distributionForm.control}
                name="bankBalance"
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <View>
                    <View style={[
                      styles.distributionInputContainer, 
                      focusedInput === 'bank' && styles.distributionInputFocused,
                      error && styles.distributionInputError
                    ]}>
                      <Text style={styles.distributionCurrencySymbol}>{selectedCurrency.symbol}</Text>
                      <TextInput
                        style={styles.distributionInput}
                        placeholder="0.00"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="decimal-pad"
                        value={value}
                        onChangeText={(text) => onChange(sanitizeDecimalInput(text))}
                        onFocus={() => setFocusedInput('bank')}
                        onBlur={() => {
                          setFocusedInput(null);
                          onBlur();
                        }}
                        editable={!updateBalance.isPending}
                      />
                      {parseFloat(value) > 0 && (
                        <View style={[styles.percentBadge, { backgroundColor: '#DBEAFE' }]}>
                          <Text style={[styles.percentText, { color: '#3B82F6' }]}>{bankPercent.toFixed(0)}%</Text>
                        </View>
                      )}
                    </View>
                    {error && (
                      <Text className="text-red-500 text-xs mt-1 ml-1">{error.message}</Text>
                    )}
                  </View>
                )}
              />
              <Text className="text-xs text-gray-400 mt-1 ml-1">Savings, checking, or any bank account balance</Text>
            </View>

            {/* Digital Input */}
            <View className="mb-6">
              <View className="flex-row items-center mb-2">
                <View style={[styles.inputIcon, { backgroundColor: '#EDE9FE' }]}>
                  <Smartphone size={18} color="#8B5CF6" />
                </View>
                <Text className="text-sm font-semibold text-gray-700 ml-2">Digital Wallets</Text>
              </View>
              <Controller
                control={distributionForm.control}
                name="digitalBalance"
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <View>
                    <View style={[
                      styles.distributionInputContainer, 
                      focusedInput === 'digital' && styles.distributionInputFocused,
                      error && styles.distributionInputError
                    ]}>
                      <Text style={styles.distributionCurrencySymbol}>{selectedCurrency.symbol}</Text>
                      <TextInput
                        style={styles.distributionInput}
                        placeholder="0.00"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="decimal-pad"
                        value={value}
                        onChangeText={(text) => onChange(sanitizeDecimalInput(text))}
                        onFocus={() => setFocusedInput('digital')}
                        onBlur={() => {
                          setFocusedInput(null);
                          onBlur();
                        }}
                        editable={!updateBalance.isPending}
                      />
                      {parseFloat(value) > 0 && (
                        <View style={[styles.percentBadge, { backgroundColor: '#EDE9FE' }]}>
                          <Text style={[styles.percentText, { color: '#8B5CF6' }]}>{digitalPercent.toFixed(0)}%</Text>
                        </View>
                      )}
                    </View>
                    {error && (
                      <Text className="text-red-500 text-xs mt-1 ml-1">{error.message}</Text>
                    )}
                  </View>
                )}
              />
              <Text className="text-xs text-gray-400 mt-1 ml-1">Bkash, Nagad, PayPal, or any mobile wallet</Text>
            </View>

            {/* Info Box */}
            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={20} color="#6366F1" />
              <Text className="text-xs text-indigo-700 ml-2 flex-1 leading-5">
                Tip: If you're unsure, estimate! You can always adjust your balances later in Settings.
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleDistributionSubmit}
              disabled={!isDistributionComplete || updateBalance.isPending}
              className={`flex-row items-center justify-center rounded-2xl py-4 px-6 mt-4 ${
                !isDistributionComplete || updateBalance.isPending
                  ? "bg-gray-400"
                  : "bg-indigo-600"
              }`}
              activeOpacity={0.8}
            >
              {updateBalance.isPending ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <CheckCircle2 size={20} color="#FFFFFF" />
                  <Text className="text-lg font-bold text-white ml-2">
                    Complete Setup
                  </Text>
                </>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleBackToTotal}
              disabled={updateBalance.isPending}
              className="flex-row items-center justify-center mt-4 mb-6"
            >
              <Ionicons name="arrow-back" size={18} color={updateBalance.isPending ? "#9CA3AF" : "#6366F1"} />
              <Text className={`font-semibold ml-1 ${updateBalance.isPending ? "text-gray-400" : "text-indigo-600"}`}>
                Back to Total Balance
              </Text>
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
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ flexGrow: 1, paddingLeft: Math.max(insets.left, 32), paddingRight: Math.max(insets.right, 32), paddingTop: Math.max(insets.top, 64), paddingBottom: Math.max(insets.bottom, 24) }} 
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1">
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
            <Controller
              control={totalForm.control}
              name="currency"
              render={({ field: { value } }) => (
                <TouchableOpacity
                  onPress={() => setShowCurrencyModal(true)}
                  style={styles.currencySelector}
                  activeOpacity={0.7}
                  disabled={updateBalance.isPending}
                >
                  <View className="flex-row items-center">
                    <Text style={styles.currencySelectorSymbol}>
                      {value.symbol}
                    </Text>
                    <View className="ml-3">
                      <Text className="text-base font-semibold text-gray-900">
                        {value.code}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        {value.name}
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-down" size={20} color="#6B7280" />
                </TouchableOpacity>
              )}
            />
          </View>

          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Your Current Balance
            </Text>
            <Controller
              control={totalForm.control}
              name="balance"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <View>
                  <View
                    style={[
                      styles.inputContainer,
                      focusedInput === 'total' && styles.inputContainerFocused,
                      error && styles.inputContainerError,
                    ]}
                  >
                    <Text style={styles.currencySymbol}>{selectedCurrency.symbol}</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="0.00"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="decimal-pad"
                      value={value}
                      onChangeText={(text) => onChange(sanitizeDecimalInput(text))}
                      onFocus={() => setFocusedInput('total')}
                      onBlur={() => {
                        setFocusedInput(null);
                        onBlur();
                      }}
                      editable={!updateBalance.isPending}
                    />
                  </View>
                  {error && (
                    <Text className="text-red-500 text-xs mt-2 ml-1">
                      {error.message}
                    </Text>
                  )}
                </View>
              )}
            />
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
            onPress={totalForm.handleSubmit(handleTotalBalanceSubmit)}
            disabled={!isTotalFormValid || updateBalance.isPending}
            className={`flex-row items-center justify-center rounded-2xl py-4 px-6 ${
              !isTotalFormValid || updateBalance.isPending
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
              totalForm.setValue("balance", "0");
              submitBalances(0, 0, 0, selectedCurrency.code);
            }}
            disabled={updateBalance.isPending}
            className="items-center justify-center mt-5"
          >
            <Text className={`text-base font-semibold ${updateBalance.isPending ? "text-gray-400" : "text-gray-600"}`}>
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
        <View style={[styles.modalOverlay, { paddingLeft: insets.left, paddingRight: insets.right }]}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom }]}>
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
                    totalForm.setValue("currency", item);
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
  inputContainerError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
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
  // Distribution screen styles
  distributionIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  progressBarContainer: {
    flexDirection: "row",
    height: 12,
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  progressSegment: {
    height: "100%",
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  inputIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  distributionInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  distributionInputFocused: {
    borderColor: "#4F46E5",
    backgroundColor: "#FFFFFF",
  },
  distributionInputError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  distributionCurrencySymbol: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4F46E5",
    marginRight: 8,
  },
  distributionInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
  },
  percentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  percentText: {
    fontSize: 12,
    fontWeight: "700",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#EEF2FF",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#C7D2FE",
  },
});

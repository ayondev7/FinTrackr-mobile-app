import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  StyleSheet,
} from "react-native";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CurrencySelector } from "./CurrencySelector";

// Schema for the total balance step
const totalBalanceSchema = z.object({
  balance: z
    .string()
    .refine(
      (val) => val === "" || val === "0" || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
      {
        message: "Please enter a valid balance amount",
      }
    ),
  currency: z.object({
    code: z.string(),
    symbol: z.string(),
    name: z.string(),
  }),
});

type TotalBalanceFormData = z.infer<typeof totalBalanceSchema>;

interface Currency {
  code: string;
  symbol: string;
  name: string;
}

interface TotalBalanceFormProps {
  defaultCurrency: Currency;
  onSubmit: (balance: number, currency: Currency) => void;
  onSkip: (currency: Currency) => void;
  isLoading: boolean;
  onOpenCurrencyModal: () => void;
}

export const TotalBalanceForm: React.FC<TotalBalanceFormProps> = ({
  defaultCurrency,
  onSubmit,
  onSkip,
  isLoading,
  onOpenCurrencyModal,
}) => {
  const insets = useSafeAreaInsets();
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // Form for total balance step
  const form = useForm<TotalBalanceFormData>({
    resolver: zodResolver(totalBalanceSchema),
    defaultValues: {
      balance: "",
      currency: defaultCurrency,
    },
    mode: "onChange",
  });

  const selectedCurrency = useWatch({ control: form.control, name: "currency" });
  const balanceValue = useWatch({ control: form.control, name: "balance" });

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

  // Handle form submission
  const handleSubmit = useCallback(
    (data: TotalBalanceFormData) => {
      Keyboard.dismiss();
      const numericBalance = parseFloat(data.balance) || 0;
      onSubmit(numericBalance, data.currency);
    },
    [onSubmit]
  );

  // Check if form is valid
  const isFormValid =
    balanceValue === "" ||
    balanceValue === "0" ||
    (!isNaN(parseFloat(balanceValue)) && parseFloat(balanceValue) >= 0);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingLeft: Math.max(insets.left, 32),
          paddingRight: Math.max(insets.right, 32),
          paddingTop: Math.max(insets.top, 64),
          paddingBottom: Math.max(insets.bottom, 24),
        }}
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
              Enter your current account balance to start tracking your finances accurately.
            </Text>
          </View>

          {/* Currency Selector */}
          <CurrencySelector
            currency={selectedCurrency}
            onPress={onOpenCurrencyModal}
            disabled={isLoading}
          />

          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Your Current Balance
            </Text>
            <Controller
              control={form.control}
              name="balance"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <View>
                  <View
                    style={[
                      styles.inputContainer,
                      focusedInput === "total" && styles.inputContainerFocused,
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
                      onFocus={() => setFocusedInput("total")}
                      onBlur={() => {
                        setFocusedInput(null);
                        onBlur();
                      }}
                      editable={!isLoading}
                    />
                  </View>
                  {error && (
                    <Text className="text-red-500 text-xs mt-2 ml-1">{error.message}</Text>
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
              <Text className="text-gray-600 flex-1">Get insights on your spending habits</Text>
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
            onPress={form.handleSubmit(handleSubmit)}
            disabled={!isFormValid || isLoading}
            className={`flex-row items-center justify-center rounded-2xl py-4 px-6 ${
              !isFormValid || isLoading ? "bg-gray-400" : "bg-indigo-600"
            }`}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text className="text-lg font-bold text-white mr-2">Continue</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              form.setValue("balance", "0");
              onSkip(selectedCurrency);
            }}
            disabled={isLoading}
            className="items-center justify-center mt-5"
          >
            <Text
              className={`text-base font-semibold ${
                isLoading ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Start with {selectedCurrency.symbol}0
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
});

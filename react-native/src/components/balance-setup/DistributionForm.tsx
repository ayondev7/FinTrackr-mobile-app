import React, { useMemo, useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  StyleSheet,
} from "react-native";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PieChart, Banknote, Building2, Smartphone, CheckCircle2 } from "lucide-react-native";
import { DistributionProgressBar } from "./DistributionProgressBar";
import { DistributionInput } from "./DistributionInput";

// Schema for the distribution step
const distributionSchema = z.object({
  cashBalance: z
    .string()
    .refine((val) => val === "" || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0), {
      message: "Please enter a valid cash amount",
    }),
  bankBalance: z
    .string()
    .refine((val) => val === "" || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0), {
      message: "Please enter a valid bank amount",
    }),
  digitalBalance: z
    .string()
    .refine((val) => val === "" || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0), {
      message: "Please enter a valid digital wallet amount",
    }),
});

type DistributionFormData = z.infer<typeof distributionSchema>;

interface Currency {
  code: string;
  symbol: string;
  name: string;
}

interface DistributionFormProps {
  totalBalance: number;
  selectedCurrency: Currency;
  onSubmit: (cash: number, bank: number, digital: number) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
  onShowError: (title: string, message: string) => void;
}

export const DistributionForm: React.FC<DistributionFormProps> = ({
  totalBalance,
  selectedCurrency,
  onSubmit,
  onBack,
  isLoading,
  onShowError,
}) => {
  const insets = useSafeAreaInsets();
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

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

  // Handle distribution form submission
  const handleDistributionSubmit = useCallback(async () => {
    Keyboard.dismiss();

    if (!isDistributionComplete) {
      if (isOverDistributed) {
        onShowError(
          "Over-distributed",
          `Your distribution exceeds the total balance by ${selectedCurrency.symbol}${Math.abs(remaining).toFixed(2)}`
        );
      } else {
        onShowError(
          "Incomplete Distribution",
          `Please distribute the remaining ${selectedCurrency.symbol}${remaining.toFixed(2)}`
        );
      }
      return;
    }

    const cash = parseFloat(cashValue) || 0;
    const bank = parseFloat(bankValue) || 0;
    const digital = parseFloat(digitalValue) || 0;

    await onSubmit(cash, bank, digital);
  }, [
    isDistributionComplete,
    isOverDistributed,
    remaining,
    cashValue,
    bankValue,
    digitalValue,
    selectedCurrency,
    onSubmit,
    onShowError,
  ]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingLeft: Math.max(insets.left, 24),
          paddingRight: Math.max(insets.right, 24),
          paddingTop: Math.max(insets.top, 48),
          paddingBottom: Math.max(insets.bottom, 24),
        }}
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
              Tell us how your {selectedCurrency.symbol}
              {totalBalance.toFixed(2)} is distributed across your accounts for accurate tracking
            </Text>
          </View>

          {/* Distribution Progress Bar */}
          <DistributionProgressBar
            totalBalance={totalBalance}
            cashValue={parseFloat(cashValue) || 0}
            bankValue={parseFloat(bankValue) || 0}
            digitalValue={parseFloat(digitalValue) || 0}
            remaining={remaining}
            isOverDistributed={isOverDistributed}
            isComplete={isDistributionComplete}
            currencySymbol={selectedCurrency.symbol}
          />

          {/* Distribution Error Message */}
          {distributionError && distributionTotal > 0 && (
            <View
              className={`mb-4 p-3 rounded-xl flex-row items-center ${
                isOverDistributed ? "bg-red-50" : "bg-amber-50"
              }`}
            >
              <Ionicons
                name={isOverDistributed ? "alert-circle" : "information-circle"}
                size={20}
                color={isOverDistributed ? "#EF4444" : "#F59E0B"}
              />
              <Text
                className={`ml-2 text-sm flex-1 ${
                  isOverDistributed ? "text-red-700" : "text-amber-700"
                }`}
              >
                {distributionError}
              </Text>
            </View>
          )}

          {/* Cash Input */}
          <DistributionInput
            name="cashBalance"
            control={distributionForm.control}
            label="Cash in Hand"
            icon={<Banknote size={18} color="#10B981" />}
            iconBackgroundColor="#D1FAE5"
            description="Physical money in your wallet or at home"
            currencySymbol={selectedCurrency.symbol}
            onFocus={() => setFocusedInput("cash")}
            onBlur={() => setFocusedInput(null)}
            isFocused={focusedInput === "cash"}
            disabled={isLoading}
            sanitizeInput={sanitizeDecimalInput}
            value={cashValue}
            totalBalance={totalBalance}
          />

          {/* Bank Input */}
          <DistributionInput
            name="bankBalance"
            control={distributionForm.control}
            label="Bank Account"
            icon={<Building2 size={18} color="#3B82F6" />}
            iconBackgroundColor="#DBEAFE"
            description="Savings, checking, or any bank account balance"
            currencySymbol={selectedCurrency.symbol}
            onFocus={() => setFocusedInput("bank")}
            onBlur={() => setFocusedInput(null)}
            isFocused={focusedInput === "bank"}
            disabled={isLoading}
            sanitizeInput={sanitizeDecimalInput}
            value={bankValue}
            totalBalance={totalBalance}
          />

          {/* Digital Input */}
          <DistributionInput
            name="digitalBalance"
            control={distributionForm.control}
            label="Digital Wallets"
            icon={<Smartphone size={18} color="#8B5CF6" />}
            iconBackgroundColor="#EDE9FE"
            description="Bkash, Nagad, PayPal, or any mobile wallet"
            currencySymbol={selectedCurrency.symbol}
            onFocus={() => setFocusedInput("digital")}
            onBlur={() => setFocusedInput(null)}
            isFocused={focusedInput === "digital"}
            disabled={isLoading}
            sanitizeInput={sanitizeDecimalInput}
            value={digitalValue}
            totalBalance={totalBalance}
          />

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={20} color="#6366F1" />
            <Text className="text-xs text-indigo-700 ml-2 flex-1 leading-5">
              Tip: If you're unsure, estimate! You can always adjust your balances later in Settings.
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleDistributionSubmit}
            disabled={!isDistributionComplete || isLoading}
            className={`flex-row items-center justify-center rounded-2xl py-4 px-6 mt-4 ${
              !isDistributionComplete || isLoading ? "bg-gray-400" : "bg-indigo-600"
            }`}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <CheckCircle2 size={20} color="#FFFFFF" />
                <Text className="text-lg font-bold text-white ml-2">Finish Setup</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onBack}
            disabled={isLoading}
            className="flex-row items-center justify-center mt-4 mb-6"
          >
            <Ionicons
              name="arrow-back"
              size={18}
              color={isLoading ? "#9CA3AF" : "#6366F1"}
            />
            <Text
              className={`font-semibold ml-1 ${
                isLoading ? "text-gray-400" : "text-indigo-600"
              }`}
            >
              Back to Total Balance
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  distributionIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
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

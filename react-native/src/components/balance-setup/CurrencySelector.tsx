import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Currency {
  code: string;
  symbol: string;
  name: string;
}

interface CurrencySelectorProps {
  currency: Currency;
  onPress: () => void;
  disabled?: boolean;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  currency,
  onPress,
  disabled = false,
}) => {
  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-gray-700 mb-2">
        Select Currency
      </Text>
      <TouchableOpacity
        onPress={onPress}
        style={styles.currencySelector}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <View className="flex-row items-center">
          <Text style={styles.currencySelectorSymbol}>{currency.symbol}</Text>
          <View className="ml-3">
            <Text className="text-base font-semibold text-gray-900">
              {currency.code}
            </Text>
            <Text className="text-xs text-gray-500">{currency.name}</Text>
          </View>
        </View>
        <Ionicons name="chevron-down" size={20} color="#6B7280" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

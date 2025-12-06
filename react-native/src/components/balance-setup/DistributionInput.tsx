import React from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Controller, Control, FieldError } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";

interface DistributionInputProps {
  name: string;
  control: Control<any>;
  label: string;
  icon: React.ReactNode;
  iconBackgroundColor: string;
  description: string;
  currencySymbol: string;
  placeholder?: string;
  onFocus: () => void;
  onBlur: () => void;
  isFocused: boolean;
  disabled?: boolean;
  sanitizeInput: (text: string) => string;
  value: string;
  totalBalance: number;
}

export const DistributionInput: React.FC<DistributionInputProps> = ({
  name,
  control,
  label,
  icon,
  iconBackgroundColor,
  description,
  currencySymbol,
  placeholder = "0.00",
  onFocus,
  onBlur,
  isFocused,
  disabled = false,
  sanitizeInput,
  value,
  totalBalance,
}) => {
  const numericValue = parseFloat(value) || 0;
  const percentage = totalBalance > 0 ? (numericValue / totalBalance) * 100 : 0;
  const showPercentage = numericValue > 0 && percentage < 100;

  return (
    <View className="mb-4">
      <View className="flex-row items-center mb-2">
        <View style={[styles.inputIcon, { backgroundColor: iconBackgroundColor }]}>
          {icon}
        </View>
        <Text className="text-sm font-semibold text-gray-700 ml-2">{label}</Text>
      </View>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur: fieldOnBlur, value }, fieldState: { error } }) => (
          <View>
            <View
              style={[
                styles.distributionInputContainer,
                isFocused && styles.distributionInputFocused,
                error && styles.distributionInputError,
              ]}
            >
              <Text style={styles.distributionCurrencySymbol}>{currencySymbol}</Text>
              <TextInput
                style={styles.distributionInput}
                placeholder={placeholder}
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
                value={value}
                onChangeText={(text) => onChange(sanitizeInput(text))}
                onFocus={onFocus}
                onBlur={() => {
                  onBlur();
                  fieldOnBlur();
                }}
                editable={!disabled}
              />
              {showPercentage && (
                <View style={[styles.percentBadge, { backgroundColor: "#EEF2FF" }]}>
                  <Text style={[styles.percentText, { color: "#4F46E5" }]}>
                    {percentage.toFixed(0)}%
                  </Text>
                </View>
              )}
            </View>
            {error && (
              <Text className="text-red-500 text-xs mt-1 ml-1">{error.message}</Text>
            )}
          </View>
        )}
      />
      <Text className="text-xs text-gray-400 mt-1 ml-1">{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

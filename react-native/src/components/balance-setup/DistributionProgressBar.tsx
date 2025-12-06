import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface DistributionProgressBarProps {
  totalBalance: number;
  cashValue: number;
  bankValue: number;
  digitalValue: number;
  remaining: number;
  isOverDistributed: boolean;
  isComplete: boolean;
  currencySymbol: string;
}

export const DistributionProgressBar: React.FC<DistributionProgressBarProps> = ({
  totalBalance,
  cashValue,
  bankValue,
  digitalValue,
  remaining,
  isOverDistributed,
  isComplete,
  currencySymbol,
}) => {
  const cashPercent = totalBalance > 0 ? (cashValue / totalBalance) * 100 : 0;
  const bankPercent = totalBalance > 0 ? (bankValue / totalBalance) * 100 : 0;
  const digitalPercent = totalBalance > 0 ? (digitalValue / totalBalance) * 100 : 0;
  const remainingPercent = totalBalance > 0 ? Math.max(0, (remaining / totalBalance) * 100) : 100;

  return (
    <View className="mb-6 px-2">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-sm font-semibold text-gray-700">
          Distribution Progress
        </Text>
        <Text
          className={`text-sm font-bold ${
            isComplete
              ? "text-green-600"
              : isOverDistributed
              ? "text-red-500"
              : "text-indigo-600"
          }`}
        >
          {isComplete
            ? "✓ Complete!"
            : `${currencySymbol}${Math.abs(remaining).toFixed(2)} ${
                isOverDistributed ? "over" : "remaining"
              }`}
        </Text>
      </View>
      <View style={styles.progressBarContainer}>
        {cashPercent > 0 && (
          <View
            style={[
              styles.progressSegment,
              { width: `${Math.min(cashPercent, 100)}%`, backgroundColor: "#10B981" },
            ]}
          />
        )}
        {bankPercent > 0 && (
          <View
            style={[
              styles.progressSegment,
              {
                width: `${Math.min(bankPercent, 100 - cashPercent)}%`,
                backgroundColor: "#3B82F6",
              },
            ]}
          />
        )}
        {digitalPercent > 0 && (
          <View
            style={[
              styles.progressSegment,
              {
                width: `${Math.min(digitalPercent, 100 - cashPercent - bankPercent)}%`,
                backgroundColor: "#8B5CF6",
              },
            ]}
          />
        )}
        {remainingPercent > 0 && !isOverDistributed && (
          <View
            style={[
              styles.progressSegment,
              { width: `${remainingPercent}%`, backgroundColor: "#E5E7EB" },
            ]}
          />
        )}
      </View>
      {/* Legend */}
      <View className="flex-row flex-wrap justify-center mt-3 gap-4">
        <View className="flex-row items-center">
          <View style={[styles.legendDot, { backgroundColor: "#10B981" }]} />
          <Text className="text-xs text-gray-600">Cash</Text>
        </View>
        <View className="flex-row items-center">
          <View style={[styles.legendDot, { backgroundColor: "#3B82F6" }]} />
          <Text className="text-xs text-gray-600">Bank</Text>
        </View>
        <View className="flex-row items-center">
          <View style={[styles.legendDot, { backgroundColor: "#8B5CF6" }]} />
          <Text className="text-xs text-gray-600">Digital</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

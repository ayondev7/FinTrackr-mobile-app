import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CURRENCIES } from "../../constants/currencies";

interface Currency {
  code: string;
  symbol: string;
  name: string;
}

interface CurrencyModalProps {
  visible: boolean;
  selectedCurrency: Currency;
  onClose: () => void;
  onSelectCurrency: (currency: Currency) => void;
}

export const CurrencyModal: React.FC<CurrencyModalProps> = ({
  visible,
  selectedCurrency,
  onClose,
  onSelectCurrency,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.modalOverlay,
          { paddingLeft: insets.left, paddingRight: insets.right },
        ]}
      >
        <View style={[styles.modalContent, { paddingBottom: insets.bottom }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Currency</Text>
            <TouchableOpacity
              onPress={onClose}
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
                  onSelectCurrency(item);
                  onClose();
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
  );
};

const styles = StyleSheet.create({
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

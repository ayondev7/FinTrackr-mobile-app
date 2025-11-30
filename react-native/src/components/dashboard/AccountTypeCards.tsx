import React, { useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import {
  Banknote,
  Building2,
  Smartphone,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { formatCurrency, formatSmartCurrency } from "../../utils/helpers";

const HORIZONTAL_PADDING = 16; // px-4 = 16px on each side

interface AccountType {
  id: string;
  name: string;
  balance: number;
  icon: React.ComponentType<{ size: number; color: string }>;
  color: string;
  percentage: number;
}

// Static data removed

// Total Balance Card (first card in the scroll)
interface TotalBalanceCardProps {
  balance: number;
  currency: string;
  balanceChangePercent: number;
  index: number;
  total: number;
  cardWidth: number;
}

const TotalBalanceCard: React.FC<TotalBalanceCardProps> = ({
  balance,
  currency,
  balanceChangePercent,
  index,
  total,
  cardWidth,
}) => {
  const isNeutral = balanceChangePercent === 0;
  const isPositiveChange = balanceChangePercent > 0;
  const TrendIcon = isNeutral
    ? Minus
    : isPositiveChange
    ? TrendingUp
    : TrendingDown;
  const trendColor = isNeutral
    ? "#9CA3AF"
    : isPositiveChange
    ? "#10B981"
    : "#EF4444";
  const trendBgColor = isNeutral
    ? "rgba(156, 163, 175, 0.15)"
    : isPositiveChange
    ? "rgba(16, 185, 129, 0.25)"
    : "rgba(239, 68, 68, 0.25)";
  const trendTextClass = isNeutral
    ? "text-gray-300"
    : isPositiveChange
    ? "text-green-300"
    : "text-red-300";

  return (
    <View
      className="p-6 rounded-3xl overflow-hidden"
      style={{
        width: cardWidth,
        backgroundColor: "#6366F1",
        shadowColor: "#6366F1",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
      }}
    >
      {/* Decorative circles */}
      <View
        className="absolute rounded-full"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          width: 160,
          height: 160,
          right: -40,
          top: -40,
        }}
      />
      <View
        className="absolute rounded-full"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          width: 120,
          height: 120,
          left: -20,
          bottom: -20,
        }}
      />

      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-indigo-100 text-sm font-medium tracking-wide">
          TOTAL BALANCE
        </Text>
        <View
          className="px-3 py-1.5 rounded-full"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
        >
          <Text className="text-white text-xs font-bold">{currency}</Text>
        </View>
      </View>

      {/* Balance */}
      <Text className="text-white text-5xl font-bold mb-4 tracking-tight">
        {formatSmartCurrency(balance, currency, 100000, 1)}
      </Text>

      {/* Footer */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View
            className="flex-row items-center px-3 py-1.5 rounded-full"
            style={{ backgroundColor: trendBgColor }}
          >
            <TrendIcon size={14} color={trendColor} />
            <Text className={`${trendTextClass} text-xs font-bold ml-1`}> 
              {isPositiveChange ? "+" : ""}
              {balanceChangePercent}%
            </Text>
          </View>
          <Text className="text-indigo-100 text-xs font-medium">
            vs last month
          </Text>
        </View>

        {/* Pagination indicator */}
        <Text className="text-white/70 text-xs font-medium">
          {index + 1} / {total}
        </Text>
      </View>
    </View>
  );
};

interface AccountTypeCardProps {
  account: AccountType;
  currency: string;
  index: number;
  total: number;
  cardWidth: number;
}

const AccountTypeCard: React.FC<AccountTypeCardProps> = ({
  account,
  currency,
  index,
  total,
  cardWidth,
}) => {
  const IconComponent = account.icon;
  const isNegative = account.balance < 0;

  return (
    <View
      className="p-6 rounded-3xl overflow-hidden"
      style={{
        width: cardWidth,
        backgroundColor: account.color,
        shadowColor: account.color,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
      }}
    >
      {/* Decorative circles */}
      <View
        className="absolute rounded-full"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          width: 160,
          height: 160,
          right: -40,
          top: -40,
        }}
      />
      <View
        className="absolute rounded-full"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          width: 120,
          height: 120,
          left: -20,
          bottom: -20,
        }}
      />

      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-3">
          <View
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.25)" }}
          >
            <IconComponent size={20} color="#FFFFFF" />
          </View>
          <Text className="text-white/90 text-sm font-semibold uppercase tracking-wide">
            {account.name}
          </Text>
        </View>
        <View
          className="px-3 py-1.5 rounded-full"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
        >
          <Text className="text-white text-xs font-bold">{currency}</Text>
        </View>
      </View>

      {/* Balance */}
      <Text
        className="text-white text-5xl font-bold mb-4 tracking-tight"
        style={{ opacity: isNegative ? 0.9 : 1 }}
      >
        {formatSmartCurrency(account.balance, currency, 100000, 1)}
      </Text>

      {/* Footer */}
      <View className="flex-row items-center justify-between">
        <View
          className="px-3 py-1.5 rounded-full"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
        >
          <Text className="text-white text-xs font-bold">
            {account.percentage}% of total
          </Text>
        </View>

        {/* Pagination indicator */}
        <Text className="text-white/70 text-xs font-medium">
          {index + 1} / {total}
        </Text>
      </View>
    </View>
  );
};

interface AccountTypeCardsProps {
  currency: string;
  totalBalance: number;
  balanceChangePercent: number;
  cashBalance: number;
  bankBalance: number;
  digitalBalance: number;
}

export const AccountTypeCards: React.FC<AccountTypeCardsProps> = ({
  currency,
  totalBalance,
  balanceChangePercent,
  cashBalance,
  bankBalance,
  digitalBalance,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isLandscape = screenWidth > screenHeight;

  const effectiveScreenWidth = screenWidth;

  let paddingLeft: number;
  let paddingRight: number;
  if (isLandscape) {
    // Landscape: minimal left gap (safe area plus 4px), keep right as usual
    paddingLeft = insets.left + 4; // a 4px gap to avoid sticking to the edge
    paddingRight = HORIZONTAL_PADDING + insets.right;
  } else {
    // Portrait: reduce both paddings more (increase card width on both sides)
    const reducedPadding = Math.max(4, HORIZONTAL_PADDING - 8); // reduce to 8, clamped to at least 4
    paddingLeft = reducedPadding + insets.left;
    paddingRight = reducedPadding + insets.right;
  }

  const cardWidth = effectiveScreenWidth - paddingLeft - paddingRight;

  const accountTypes: AccountType[] = [
    {
      id: "cash",
      name: "Cash",
      balance: cashBalance,
      icon: Banknote,
      color: "#10B981",
      percentage:
        totalBalance > 0 ? Math.round((cashBalance / totalBalance) * 100) : 0,
    },
    {
      id: "bank",
      name: "Bank Account",
      balance: bankBalance,
      icon: Building2,
      color: "#3B82F6",
      percentage:
        totalBalance > 0 ? Math.round((bankBalance / totalBalance) * 100) : 0,
    },
    {
      id: "digital",
      name: "Digital Banking",
      balance: digitalBalance,
      icon: Smartphone,
      color: "#8B5CF6",
      percentage:
        totalBalance > 0
          ? Math.round((digitalBalance / totalBalance) * 100)
          : 0,
    },
  ];

  const totalCards = accountTypes.length + 1;
  const allCardColors = ["#6366F1", ...accountTypes.map((a) => a.color)];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / effectiveScreenWidth);
    setActiveIndex(Math.max(0, Math.min(index, totalCards - 1)));
  };

  return (
    <View className="mb-6">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View
          style={{
            width: effectiveScreenWidth,
            paddingLeft,
            paddingRight,
          }}
        >
          <TotalBalanceCard
            balance={totalBalance}
            currency={currency}
            balanceChangePercent={balanceChangePercent}
            index={0}
            total={totalCards}
            cardWidth={cardWidth}
          />
        </View>

        {accountTypes.map((account, index) => (
          <View
            key={account.id}
            style={{
              width: effectiveScreenWidth,
              paddingLeft,
              paddingRight,
            }}
          >
            <AccountTypeCard
              account={account}
              currency={currency}
              index={index + 1}
              total={totalCards}
              cardWidth={cardWidth}
            />
          </View>
        ))}
      </ScrollView>

      <View className="flex-row items-center justify-center mt-4 gap-2">
        {allCardColors.map((color, index) => (
          <View
            key={index}
            className="rounded-full"
            style={{
              width: activeIndex === index ? 20 : 8,
              height: 8,
              backgroundColor:
                activeIndex === index ? color : "rgba(156, 163, 175, 0.4)",
            }}
          />
        ))}
      </View>
    </View>
  );
};

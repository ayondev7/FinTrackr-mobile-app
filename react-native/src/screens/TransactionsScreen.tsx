import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  TimePeriodFilter, 
  TypeFilter, 
  TotalsSummary, 
  TransactionHeader, 
} from '../components/transactions';
import { TransactionItem, Loader } from '../components/shared';
import { useInfiniteTransactions, useTransactionStats, useUserProfile } from '../hooks';
import { useThemeStore } from '../store';
import { colors } from '../constants/theme';
import { TimePeriod, FilterType, SortBy, Transaction } from '../types';
import { FileText } from 'lucide-react-native';

export const TransactionsScreen = () => {
  const insets = useSafeAreaInsets();
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  const isDark = theme === 'dark';

  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('monthly');

  const { data: userResponse } = useUserProfile();
  const currency = userResponse?.data?.currency || 'USD';


  const queryParams = useMemo(() => ({
    type: filterType,
    timePeriod,
    sortBy,
    limit: 15,
  }), [filterType, timePeriod, sortBy]);

 
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching
  } = useInfiniteTransactions(queryParams);

  
  const { data: statsData, refetch: refetchStats } = useTransactionStats({ timePeriod });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetch(), refetchStats()]);
    } finally {
      setIsRefreshing(false);
    }
  };

  
  const transactions = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.data.transactions);
  }, [data?.pages]);

  const totalCount = data?.pages[0]?.data.pagination.total ?? 0;
  const totalExpense = statsData?.data.totalExpense ?? 0;
  const totalRevenue = statsData?.data.totalRevenue ?? 0;


  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);


  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4 items-center">
        <Loader size={32} />
      </View>
    );
  };

  // Render empty state
  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View className="items-center justify-center py-12">
        <FileText size={64} color={isDark ? '#4B5563' : '#D1D5DB'} />
        <Text className="text-gray-500 dark:text-gray-400 text-center mt-4">
          No transactions found
        </Text>
      </View>
    );
  };

  const renderItem = useCallback(({ item }: { item: Transaction }) => (
    <TransactionItem transaction={item} currency={currency} />
  ), [currency]);

  if (isLoading) {
    return (
      <View 
        className="flex-1 bg-gray-50 dark:bg-slate-900 justify-center items-center"
        style={{ paddingTop: insets.top }}
      >
        <Loader size={64} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 dark:bg-slate-900">
      <View 
        className="p-4 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700" 
        style={{ paddingTop: insets.top + 16 }}
      >
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Transactions
        </Text>

        <TimePeriodFilter
          timePeriod={timePeriod}
          onSelect={setTimePeriod}
        />

        <TypeFilter
          filterType={filterType}
          onSelect={setFilterType}
        />

        <TotalsSummary
          totalExpense={totalExpense}
          totalRevenue={totalRevenue}
          currency={currency}
        />
      </View>

      <View className="flex-1 px-4 pt-4">
        <TransactionHeader
          count={totalCount}
          sortBy={sortBy}
          onToggleSort={() => setSortBy(sortBy === 'date' ? 'amount' : 'date')}
          primaryColor={themeColors.primary}
        />

        <FlatList
          data={transactions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[themeColors.primary]}
              tintColor={themeColors.primary}
              progressBackgroundColor={theme === 'dark' ? themeColors.card : themeColors.background}
            />
          }
        />
      </View>
    </View>
  );
};

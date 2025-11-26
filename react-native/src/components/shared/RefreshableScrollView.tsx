import React from 'react';
import { ScrollView, RefreshControl, ScrollViewProps } from 'react-native';
import { useThemeStore } from '../../store';
import { colors } from '../../constants/theme';

interface RefreshableScrollViewProps extends ScrollViewProps {
  onRefresh?: () => Promise<void> | void;
  refreshing?: boolean;
}

export const RefreshableScrollView: React.FC<RefreshableScrollViewProps> = ({
  children,
  onRefresh,
  refreshing: externalRefreshing,
  ...props
}) => {
  const { theme } = useThemeStore();
  const themeColors = colors[theme];

  const [internalRefreshing, setInternalRefreshing] = React.useState(false);

  const isRefreshing = externalRefreshing !== undefined ? externalRefreshing : internalRefreshing;

  const handleRefresh = async () => {
    if (onRefresh) {
      if (externalRefreshing === undefined) {
        setInternalRefreshing(true);
      }
      try {
        await onRefresh();
      } finally {
        if (externalRefreshing === undefined) {
          setInternalRefreshing(false);
        }
      }
    }
  };

  return (
    <ScrollView
      {...props}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[themeColors.primary]} // Android
            tintColor={themeColors.primary} // iOS
            progressBackgroundColor={theme === 'dark' ? themeColors.card : themeColors.background}
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  );
};

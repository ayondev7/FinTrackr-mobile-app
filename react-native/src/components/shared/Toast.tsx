import React, { useEffect } from 'react';
import { View, Text, Animated, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react-native';
import { colors, borderRadius, shadows } from '../../constants/theme';
import { useThemeStore } from '../../store/themeStore';

const { width } = Dimensions.get('window');

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 3000,
  onDismiss,
}) => {
  const { theme } = useThemeStore();
  const themeColors = theme === 'dark' ? colors.dark : colors.light;
  const translateY = React.useRef(new Animated.Value(-100)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss(id);
    });
  };

  const getToastConfig = () => {
    // Use a small palette so the toast background is a lighter tint
    // while the content (icon + text) uses a stronger/darker color.
    const palette = {
      // For light mode use the same theme colors the ToastTestScreen uses
      // and produce a subtle background tint by appending a light alpha.
      light: {
        // Use the original soft background tints and keep the current
        // theme color as the foreground (icon/text) which you preferred.
        success: { bg: '#ECFDF5', fg: themeColors.success },
        error: { bg: '#FEF2F2', fg: themeColors.danger },
        warning: { bg: '#FFFBEB', fg: themeColors.warning },
        info: { bg: '#EFF6FF', fg: themeColors.info },
      },
      dark: {
        // For dark mode use a subtle tinted background and keep the
        // theme color for foreground so content remains visible.
        success: { bg: 'rgba(52,211,153,0.12)', fg: themeColors.success },
        error: { bg: 'rgba(239,68,68,0.12)', fg: themeColors.danger },
        warning: { bg: 'rgba(245,158,11,0.12)', fg: themeColors.warning },
        info: { bg: 'rgba(59,130,246,0.12)', fg: themeColors.info },
      },
    } as const;

    const mode = theme === 'dark' ? 'dark' : 'light';

    switch (type) {
      case 'success':
        return { icon: CheckCircle, backgroundColor: palette[mode].success.bg, iconColor: palette[mode].success.fg, textColor: palette[mode].success.fg };
      case 'error':
        return { icon: XCircle, backgroundColor: palette[mode].error.bg, iconColor: palette[mode].error.fg, textColor: palette[mode].error.fg };
      case 'warning':
        return { icon: AlertCircle, backgroundColor: palette[mode].warning.bg, iconColor: palette[mode].warning.fg, textColor: palette[mode].warning.fg };
      case 'info':
        return { icon: Info, backgroundColor: palette[mode].info.bg, iconColor: palette[mode].info.fg, textColor: palette[mode].info.fg };
    }
  };

  const config = getToastConfig();
  const Icon = config.icon;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
          backgroundColor: config.backgroundColor,
        },
        shadows.lg,
      ]}
    >
      <View style={styles.iconContainer}>
        <Icon size={24} color={config.iconColor} strokeWidth={2.5} />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: (config as any).textColor || config.iconColor }]} numberOfLines={1}>
          {title}
        </Text>
        {message && (
          <Text style={[styles.message, { color: (config as any).textColor || config.iconColor }]} numberOfLines={2}>
            {message}
          </Text>
        )}
      </View>

      <TouchableOpacity
        onPress={handleDismiss}
        style={styles.closeButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <X size={20} color={(config as any).textColor || config.iconColor} strokeWidth={2} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    maxWidth: width - 32,
    borderRadius: borderRadius.md,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    zIndex: 9999,
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  contentContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    opacity: 0.9,
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
    marginTop: 2,
  },
});

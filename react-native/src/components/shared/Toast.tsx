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
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          backgroundColor: themeColors.success,
          iconColor: '#FFFFFF',
        };
      case 'error':
        return {
          icon: XCircle,
          backgroundColor: themeColors.danger,
          iconColor: '#FFFFFF',
        };
      case 'warning':
        return {
          icon: AlertCircle,
          backgroundColor: themeColors.warning,
          iconColor: '#FFFFFF',
        };
      case 'info':
        return {
          icon: Info,
          backgroundColor: themeColors.info,
          iconColor: '#FFFFFF',
        };
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
        <Text style={[styles.title, { color: config.iconColor }]} numberOfLines={1}>
          {title}
        </Text>
        {message && (
          <Text style={[styles.message, { color: config.iconColor }]} numberOfLines={2}>
            {message}
          </Text>
        )}
      </View>

      <TouchableOpacity
        onPress={handleDismiss}
        style={styles.closeButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <X size={20} color={config.iconColor} strokeWidth={2} />
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

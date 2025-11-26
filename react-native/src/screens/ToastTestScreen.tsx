import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useToastStore } from '../store/toastStore';
import { colors, spacing, borderRadius } from '../constants/theme';
import { useThemeStore } from '../store/themeStore';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react-native';

export const ToastTestScreen: React.FC = () => {
  const { theme } = useThemeStore();
  const themeColors = theme === 'dark' ? colors.dark : colors.light;
  const { showSuccess, showError, showWarning, showInfo } = useToastStore();

  const toastTests = [
    {
      title: 'Success Toast',
      subtitle: 'Short message',
      icon: CheckCircle,
      color: themeColors.success,
      action: () => showSuccess('Success!', 'Operation completed successfully'),
    },
    {
      title: 'Success Toast',
      subtitle: 'Long message',
      icon: CheckCircle,
      color: themeColors.success,
      action: () =>
        showSuccess(
          'Payment Received',
          'Your payment of $1,234.56 has been received and processed successfully',
          4000
        ),
    },
    {
      title: 'Error Toast',
      subtitle: 'Short message',
      icon: XCircle,
      color: themeColors.danger,
      action: () => showError('Error!', 'Something went wrong'),
    },
    {
      title: 'Error Toast',
      subtitle: 'Long message',
      icon: XCircle,
      color: themeColors.danger,
      action: () =>
        showError(
          'Transaction Failed',
          'Unable to process your transaction. Please check your connection and try again',
          4000
        ),
    },
    {
      title: 'Warning Toast',
      subtitle: 'Short message',
      icon: AlertCircle,
      color: themeColors.warning,
      action: () => showWarning('Warning!', 'Please check your input'),
    },
    {
      title: 'Warning Toast',
      subtitle: 'Long message',
      icon: AlertCircle,
      color: themeColors.warning,
      action: () =>
        showWarning(
          'Budget Limit Approaching',
          'You have spent 85% of your monthly budget. Consider adjusting your spending',
          4000
        ),
    },
    {
      title: 'Info Toast',
      subtitle: 'Short message',
      icon: Info,
      color: themeColors.info,
      action: () => showInfo('Info', 'Here is some information'),
    },
    {
      title: 'Info Toast',
      subtitle: 'Long message',
      icon: Info,
      color: themeColors.info,
      action: () =>
        showInfo(
          'New Feature Available',
          'Check out our new analytics dashboard with detailed spending insights and predictions',
          4000
        ),
    },
    {
      title: 'Title Only',
      subtitle: 'Success without message',
      icon: CheckCircle,
      color: themeColors.success,
      action: () => showSuccess('Saved!'),
    },
    {
      title: 'Multiple Toasts',
      subtitle: 'Trigger 3 at once',
      icon: Info,
      color: themeColors.info,
      action: () => {
        showSuccess('First Toast', 'This is the first toast');
        setTimeout(() => showWarning('Second Toast', 'This is the second toast'), 200);
        setTimeout(() => showInfo('Third Toast', 'This is the third toast'), 400);
      },
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: themeColors.text.primary }]}>
          Toast Notifications
        </Text>
        <Text style={[styles.headerSubtitle, { color: themeColors.text.secondary }]}>
          Tap any button to test different toast styles
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {toastTests.map((test, index) => {
          const Icon = test.icon;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.testButton,
                {
                  backgroundColor: themeColors.card,
                  borderColor: themeColors.border,
                },
              ]}
              onPress={test.action}
              activeOpacity={0.7}
            >
              <View style={[styles.iconCircle, { backgroundColor: test.color + '15' }]}>
                <Icon size={24} color={test.color} strokeWidth={2} />
              </View>
              <View style={styles.testContent}>
                <Text style={[styles.testTitle, { color: themeColors.text.primary }]}>
                  {test.title}
                </Text>
                <Text style={[styles.testSubtitle, { color: themeColors.text.secondary }]}>
                  {test.subtitle}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: themeColors.text.tertiary }]}>
            Toasts auto-dismiss after 3-4 seconds
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: 15,
    lineHeight: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingTop: spacing.md,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  testContent: {
    flex: 1,
  },
  testTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  testSubtitle: {
    fontSize: 14,
  },
  footer: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
});

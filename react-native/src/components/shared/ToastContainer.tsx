import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Toast } from './Toast';
import { useToastStore } from '../../store';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map((toast, index: number) => (
        <View key={toast.id} style={[styles.toastWrapper, { top: 0 + index * 90 }]}>
          <Toast
            id={toast.id}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            duration={toast.duration}
            onDismiss={removeToast}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  toastWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
});

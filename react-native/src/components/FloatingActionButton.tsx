import React, { useState } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Plus, X, Receipt, Tag } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemeStore } from '../store';
import { colors } from '../constants/theme';

export const FloatingActionButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [rotateAnimation] = useState(new Animated.Value(0));
  const navigation = useNavigation();
  const { theme } = useThemeStore();
  const themeColors = colors[theme];

  const toggleMenu = () => {
    const toValue = isExpanded ? 0 : 1;
    
    Animated.parallel([
      Animated.spring(animation, {
        toValue,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(rotateAnimation, {
        toValue,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    setIsExpanded(!isExpanded);
  };

  const handleAddTransaction = () => {
    toggleMenu();
    setTimeout(() => {
      navigation.navigate('Add' as never);
    }, 200);
  };

  const handleAddCategory = () => {
    toggleMenu();
    setTimeout(() => {
      navigation.navigate('AddCategory' as never);
    }, 200);
  };

  const rotation = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const transactionButtonTranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -80],
  });

  const categoryButtonTranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -150],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <View style={styles.container}>
      {/* Backdrop */}
      {isExpanded && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={toggleMenu}
          style={styles.backdrop}
        />
      )}

      {/* Add Category Button */}
      <Animated.View
        style={[
          styles.secondaryButton,
          {
            transform: [
              { translateY: categoryButtonTranslateY },
              { scale },
            ],
            opacity,
          },
        ]}
      >
        <TouchableOpacity
          onPress={handleAddCategory}
          style={[
            styles.secondaryButtonTouchable,
            { backgroundColor: '#8B5CF6' },
          ]}
          activeOpacity={0.8}
        >
          <Tag color="white" size={24} strokeWidth={2.5} />
        </TouchableOpacity>
      </Animated.View>

      {/* Add Transaction Button */}
      <Animated.View
        style={[
          styles.secondaryButton,
          {
            transform: [
              { translateY: transactionButtonTranslateY },
              { scale },
            ],
            opacity,
          },
        ]}
      >
        <TouchableOpacity
          onPress={handleAddTransaction}
          style={[
            styles.secondaryButtonTouchable,
            { backgroundColor: '#10B981' },
          ]}
          activeOpacity={0.8}
        >
          <Receipt color="white" size={24} strokeWidth={2.5} />
        </TouchableOpacity>
      </Animated.View>

      {/* Main FAB Button */}
      <TouchableOpacity
        onPress={toggleMenu}
        style={[
          styles.mainButton,
          { backgroundColor: themeColors.primary },
        ]}
        activeOpacity={0.9}
      >
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          {isExpanded ? (
            <X color="white" size={32} strokeWidth={2.5} />
          ) : (
            <Plus color="white" size={32} strokeWidth={2.5} />
          )}
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    alignItems: 'center',
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: -1000,
    left: -1000,
    right: -1000,
    bottom: -100,
    backgroundColor: 'transparent',
  },
  mainButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  secondaryButton: {
    position: 'absolute',
    bottom: 0,
  },
  secondaryButtonTouchable: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
});

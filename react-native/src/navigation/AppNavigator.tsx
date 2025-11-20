import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Platform } from 'react-native';
import { useThemeStore } from '../store';
import { colors } from '../constants/theme';
import {
  DashboardScreen,
  TransactionsScreen,
  AddTransactionScreen,
  AnalyticsScreen,
  CategoriesScreen,
  AddCategoryScreen,
  HealthcareScreen,
  PredictionsScreen,
  SettingsScreen,
} from '../screens';
import { LayoutDashboard, CreditCard, Plus, PieChart, Settings } from 'lucide-react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainTabs = () => {
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  const isDark = theme === 'dark';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
          borderRadius: 35,
          height: 70,
          borderTopWidth: 0,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.5,
          elevation: 5,
          paddingBottom: 0,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View className={`flex-row items-center px-4 py-2 rounded-full ${focused ? (isDark ? 'bg-slate-700' : 'bg-indigo-50') : ''}`}>
              <LayoutDashboard color={focused ? themeColors.primary : color} size={24} />
              {focused && (
                <Text className="ml-2 font-semibold" style={{ color: themeColors.primary }}>
                  Home
                </Text>
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View className={`flex-row items-center px-4 py-2 rounded-full ${focused ? (isDark ? 'bg-slate-700' : 'bg-indigo-50') : ''}`}>
              <CreditCard color={focused ? themeColors.primary : color} size={24} />
              {focused && (
                <Text className="ml-2 font-semibold" style={{ color: themeColors.primary }}>
                  Txns
                </Text>
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddTransactionScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: themeColors.primary,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 30,
                shadowColor: themeColors.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              <Plus color="#FFFFFF" size={32} strokeWidth={2.5} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View className={`flex-row items-center px-4 py-2 rounded-full ${focused ? (isDark ? 'bg-slate-700' : 'bg-indigo-50') : ''}`}>
              <PieChart color={focused ? themeColors.primary : color} size={24} />
              {focused && (
                <Text className="ml-2 font-semibold" style={{ color: themeColors.primary }}>
                  Stats
                </Text>
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View className={`flex-row items-center px-4 py-2 rounded-full ${focused ? (isDark ? 'bg-slate-700' : 'bg-indigo-50') : ''}`}>
              <Settings color={focused ? themeColors.primary : color} size={24} />
              {focused && (
                <Text className="ml-2 font-semibold" style={{ color: themeColors.primary }}>
                  Set
                </Text>
              )}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const { theme } = useThemeStore();

  return (
    <NavigationContainer
      theme={{
        dark: theme === 'dark',
        colors: {
          primary: colors[theme].primary,
          background: colors[theme].background,
          card: colors[theme].card,
          text: colors[theme].text.primary,
          border: colors[theme].border,
          notification: colors[theme].accent,
        },
        fonts: {
          regular: { fontFamily: 'System', fontWeight: '400' },
          medium: { fontFamily: 'System', fontWeight: '500' },
          bold: { fontFamily: 'System', fontWeight: '700' },
          heavy: { fontFamily: 'System', fontWeight: '900' },
        },
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Categories" component={CategoriesScreen} />
        <Stack.Screen name="AddCategory" component={AddCategoryScreen} />
        <Stack.Screen name="Healthcare" component={HealthcareScreen} />
        <Stack.Screen name="Predictions" component={PredictionsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

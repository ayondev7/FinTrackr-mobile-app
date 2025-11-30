import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useThemeStore } from '../store';
import { colors } from '../constants/theme';
import { CustomTabBar, FloatingActionButton } from '../components';
import {
  DashboardScreen,
  TransactionsScreen,
  AddTransactionScreen,
  AnalyticsScreen,
  CategoriesScreen,
  AddCategoryScreen,
  CategoryDetailScreen,
  BudgetsScreen,
  AddBudgetScreen,
  PredictionsScreen,
  SettingsScreen,
  
} from '../screens';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainTabs = () => {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        tabBar={props => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Transactions" component={TransactionsScreen} />
        <Tab.Screen name="Predictions" component={PredictionsScreen} />
        <Tab.Screen name="Analytics" component={AnalyticsScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
      <FloatingActionButton />
    </View>
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
        <Stack.Screen name="Add" component={AddTransactionScreen} />
        <Stack.Screen name="Categories" component={CategoriesScreen} />
        <Stack.Screen name="AddCategory" component={AddCategoryScreen} />
        <Stack.Screen name="CategoryDetail" component={CategoryDetailScreen} />
        <Stack.Screen name="Budgets" component={BudgetsScreen} />
        <Stack.Screen name="AddBudget" component={AddBudgetScreen} />
        {/* Developer-only ToastTest screen removed */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

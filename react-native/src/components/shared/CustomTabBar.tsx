import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LayoutDashboard, CreditCard, TrendingUp, PieChart, Settings } from 'lucide-react-native';
import { useThemeStore } from '../../store';
import { colors } from '../../constants/theme';

export const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  const isDark = theme === 'dark';
  const insets = useSafeAreaInsets();

  return (
    <View 
      className="absolute px-4 bg-white dark:bg-slate-800 rounded-[35px] h-[70px] flex-row items-center justify-between shadow-md shadow-black/25 elevation-5"
      style={{
        bottom: Math.max(insets.bottom, 20),
        left: Math.max(insets.left, 20),
        right: Math.max(insets.right, 20),
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        let IconComponent;
        let label = route.name;

        switch (route.name) {
            case 'Dashboard': 
                IconComponent = LayoutDashboard; 
                label = 'Home';
                break;
            case 'Transactions': 
                IconComponent = CreditCard; 
                label = 'Txns';
                break;
            case 'Predictions': 
                IconComponent = TrendingUp; 
                label = 'Predictions';
                break;
            case 'Analytics': 
                IconComponent = PieChart; 
                label = 'Stats';
                break;
            case 'Settings': 
                IconComponent = Settings; 
                label = 'Set';
                break;
            default: 
                IconComponent = LayoutDashboard;
        }

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            className="flex-1 items-center justify-center h-full"
          >
             <View
               className="items-center justify-center"
               style={{
                 width: 48,
                 height: 48,
                 borderRadius: 24,
                 overflow: 'hidden',
                 alignItems: 'center',
                 justifyContent: 'center',
                 backgroundColor: isFocused ? (isDark ? '#334155' : '#eef2ff') : 'transparent',
               }}
             >
                <IconComponent
                    size={24}
                    color={isFocused ? themeColors.primary : (isDark ? '#94A3B8' : '#64748B')}
                />
             </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

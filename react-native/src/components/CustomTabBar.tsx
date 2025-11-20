import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LayoutDashboard, CreditCard, Plus, PieChart, Settings } from 'lucide-react-native';
import { useThemeStore } from '../store';
import { colors } from '../constants/theme';

export const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  const isDark = theme === 'dark';

  return (
    <View 
      className="absolute bottom-5 left-5 right-5 bg-white dark:bg-slate-800 rounded-[35px] h-[70px] flex-row items-center justify-between shadow-lg shadow-black/25 elevation-5"
      style={{
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
            case 'Add': 
                IconComponent = Plus; 
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
        
        if (route.name === 'Add') {
             return (
                <View key={route.key} className="w-[20%] items-center z-50">
                    <TouchableOpacity
                        onPress={onPress}
                        onLongPress={onLongPress}
                        className="top-[-30px] items-center justify-center"
                        style={{
                            shadowColor: themeColors.primary,
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.4,
                            shadowRadius: 12,
                            elevation: 8,
                        }}
                    >
                        <View className="w-14 h-14 rounded-full bg-indigo-600 items-center justify-center">
                            <Plus color="white" size={32} strokeWidth={2.5} />
                        </View>
                    </TouchableOpacity>
                </View>
             )
        }

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            className="flex-1 items-center justify-center h-full"
          >
             <View className={`flex-row items-center px-3 py-2 rounded-2xl ${isFocused ? (isDark ? 'bg-slate-700' : 'bg-indigo-50') : 'bg-transparent'}`}>
                <IconComponent 
                    size={24} 
                    color={isFocused ? themeColors.primary : (isDark ? '#94A3B8' : '#64748B')} 
                />
                {isFocused && (
                    <Text 
                        className="ml-2 font-semibold text-indigo-600 dark:text-indigo-400 text-xs"
                        numberOfLines={1}
                    >
                        {label}
                    </Text>
                )}
             </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CreditCard, TrendingUp, PieChart, Settings } from 'lucide-react';
import { useThemeStore } from '@/store';
import { colors } from '@/constants/theme';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  const isDark = theme === 'dark';

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
    { name: 'Transactions', path: '/transactions', icon: CreditCard, label: 'Txns' },
    { name: 'Predictions', path: '/predictions', icon: TrendingUp, label: 'Predict' },
    { name: 'Analytics', path: '/analytics', icon: PieChart, label: 'Stats' },
    { name: 'Settings', path: '/settings', icon: Settings, label: 'Set' },
  ];

  return (
    <nav 
      className="fixed bottom-5 left-5 right-5 max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-[35px] h-[70px] flex items-center justify-between px-4 z-50"
      style={{
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
      }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;
        
        return (
          <Link
            key={item.name}
            href={item.path}
            className="flex-1 flex items-center justify-center h-full"
          >
            <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors ${
              isActive ? (isDark ? 'bg-slate-700' : 'bg-indigo-50') : 'bg-transparent'
            }`}>
              <Icon
                size={24}
                color={isActive ? themeColors.primary : (isDark ? '#94A3B8' : '#64748B')}
              />
            </div>
          </Link>
        );
      })}
    </nav>
  );
};

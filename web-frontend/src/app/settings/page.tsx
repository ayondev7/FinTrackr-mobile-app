'use client';

import React from 'react';
import { BottomNav, FloatingActionButton } from '@/components/navigation';
import { useThemeStore, useUserStore, useTransactionStore, useOnboardingStore } from '@/store';
import { colors } from '@/constants/theme';
import { User, Moon, Sun, DollarSign, Bell, Shield, Download, Trash2, LogOut } from 'lucide-react';
import { Card } from '@/components/shared';

export default function SettingsPage() {
  const { theme, toggleTheme } = useThemeStore();
  const { user } = useUserStore();
  const { clearTransactions } = useTransactionStore();
  const { reset } = useOnboardingStore();
  const themeColors = colors[theme];
  const isDark = theme === 'dark';

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all transactions? This action cannot be undone.')) {
      clearTransactions();
    }
  };

  const handleResetOnboarding = () => {
    if (confirm('This will log you out and show the onboarding screens again. Continue?')) {
      reset();
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-32 max-w-2xl mx-auto">
        <div className="p-6 pt-16">
          <div className="flex items-center gap-3 mb-6">
            <h1 className="text-gray-900 dark:text-white text-3xl font-bold">
              Settings
            </h1>
          </div>

          <Card className="mb-6 p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                <User size={32} color={themeColors.primary} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {user.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
            </div>
          </Card>

          <Card className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Appearance
            </h2>
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-xl active:scale-95 transition-transform"
            >
              <div className="flex items-center gap-3">
                {isDark ? <Moon size={20} /> : <Sun size={20} />}
                <span className="font-medium text-gray-900 dark:text-white">
                  {isDark ? 'Dark Mode' : 'Light Mode'}
                </span>
              </div>
              <div
                className="w-12 h-6 rounded-full relative transition-colors"
                style={{ backgroundColor: isDark ? themeColors.primary : '#E5E7EB' }}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    isDark ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </div>
            </button>
          </Card>

          <Card className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Preferences
            </h2>
            <div className="space-y-3">
              <button
                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-xl active:scale-95 transition-transform"
                style={{ color: themeColors.success }}
              >
                <div className="flex items-center gap-3">
                  <DollarSign size={20} />
                  <span className="font-medium text-gray-900 dark:text-white">
                    Currency: {user.currency}
                  </span>
                </div>
              </button>
              <button
                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-xl active:scale-95 transition-transform"
                style={{ color: themeColors.info }}
              >
                <div className="flex items-center gap-3">
                  <Bell size={20} />
                  <span className="font-medium text-gray-900 dark:text-white">
                    Notifications
                  </span>
                </div>
              </button>
            </div>
          </Card>

          <Card className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Data & Privacy
            </h2>
            <div className="space-y-3">
              <button
                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-xl active:scale-95 transition-transform"
                style={{ color: themeColors.primary }}
              >
                <div className="flex items-center gap-3">
                  <Download size={20} />
                  <span className="font-medium text-gray-900 dark:text-white">
                    Export Data
                  </span>
                </div>
              </button>
              <button
                onClick={handleClearData}
                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-xl active:scale-95 transition-transform"
                style={{ color: themeColors.danger }}
              >
                <div className="flex items-center gap-3">
                  <Trash2 size={20} />
                  <span className="font-medium text-gray-900 dark:text-white">
                    Clear All Data
                  </span>
                </div>
              </button>
            </div>
          </Card>

          <Card className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Developer Options
            </h2>
            <button
              onClick={handleResetOnboarding}
              className="w-full p-4 bg-orange-500 rounded-xl font-semibold text-white active:scale-95 transition-transform"
            >
              Reset Onboarding
            </button>
          </Card>

          <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-4">
            FinTrackr v1.0.0
          </p>
        </div>
      </div>
      
      <BottomNav />
      <FloatingActionButton />
    </>
  );
}

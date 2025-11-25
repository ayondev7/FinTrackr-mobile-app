'use client';

import React from 'react';
import Image from 'next/image';
import { useOnboardingStore } from '@/store';

export default function LoginPage() {
  const { setIsAuthenticated } = useOnboardingStore();

  const handleSkip = () => {
    setIsAuthenticated(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col">
      <div className="flex-1 flex flex-col justify-between px-8 pt-16 pb-12 max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-center mt-8">
          <div className="relative w-36 h-36">
            <Image
              src="https://ik.imagekit.io/swiftChat/fintrackr/auth-logo.webp"
              alt="FinTrackr Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-4">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white text-center mb-4">
            Welcome to
            <br />
            <span className="text-indigo-600">FinTrackr</span>
          </h1>
          
          <p className="text-base text-gray-500 dark:text-gray-400 text-center mb-2 leading-6">
            Your <span className="font-bold text-gray-700 dark:text-gray-300">smart companion</span> for
          </p>
          
          <p className="text-base text-gray-500 dark:text-gray-400 text-center mb-8 leading-6">
            <span className="font-semibold text-gray-700 dark:text-gray-300">effortless</span> money management
          </p>

          <div className="mb-12">
            <div className="flex items-center mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-600 mr-3" />
              <p className="text-gray-600 dark:text-gray-400 text-base">
                <span className="font-bold text-gray-800 dark:text-gray-200">Track</span> your expenses in real-time
              </p>
            </div>
            
            <div className="flex items-center mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-600 mr-3" />
              <p className="text-gray-600 dark:text-gray-400 text-base">
                <span className="font-bold text-gray-800 dark:text-gray-200">Visualize</span> your spending habits
              </p>
            </div>
            
            <div className="flex items-center mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-600 mr-3" />
              <p className="text-gray-600 dark:text-gray-400 text-base">
                <span className="font-bold text-gray-800 dark:text-gray-200">Achieve</span> your financial goals
              </p>
            </div>
          </div>

          <button
            className="w-full bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl py-5 px-6 mb-4 active:scale-95 transition-transform"
            style={{
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            }}
          >
            <div className="flex items-center justify-center">
              <div className="bg-gray-100 dark:bg-slate-700 p-2 rounded-xl mr-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <span className="text-gray-900 dark:text-white text-lg font-bold tracking-wide">
                Continue with Google
              </span>
            </div>
          </button>

          <p className="text-xs text-gray-400 dark:text-gray-500 text-center px-8 leading-5">
            By continuing, you agree to our{' '}
            <span className="text-indigo-600 font-semibold">Terms of Service</span>
            {' '}and{' '}
            <span className="text-indigo-600 font-semibold">Privacy Policy</span>
          </p>

          <button
            onClick={handleSkip}
            className="w-full bg-transparent border-2 border-gray-200 dark:border-gray-700 rounded-2xl py-4 px-6 mt-4 active:scale-95 transition-transform"
          >
            <span className="text-gray-600 dark:text-gray-400 text-base font-semibold">
              Skip for now
            </span>
          </button>
        </div>

        <div className="flex items-center justify-center pb-4">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Made with <span className="text-red-500">♥</span> for your financial freedom
          </p>
        </div>
      </div>
    </div>
  );
}

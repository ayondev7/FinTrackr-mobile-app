'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/store';
import { SplashScreen } from '@/components/splash';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const { hasSeenOnboarding, isAuthenticated } = useOnboardingStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || showSplash) return;

    if (!hasSeenOnboarding) {
      router.push('/onboarding');
    } else if (!isAuthenticated) {
      router.push('/login');
    } else {
      router.push('/dashboard');
    }
  }, [isClient, showSplash, hasSeenOnboarding, isAuthenticated, router]);

  if (!isClient) {
    return null;
  }

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return null;
}

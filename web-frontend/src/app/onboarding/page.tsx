'use client';

import React, { useState } from 'react';
import { OnboardingSlide, Paginator, OnboardingFooter } from '@/components/onboarding';
import { useOnboardingStore } from '@/store';

interface Slide {
  id: string;
  title: string;
  description: string;
  image: string;
  bgColor: string;
}

const slides: Slide[] = [
  {
    id: '1',
    title: 'Take Control Of\nYour Finances',
    description: 'Track every penny with ease. Monitor all your expenses and income in one beautifully designed app.',
    image: 'https://ik.imagekit.io/swiftChat/fintrackr/1.webp',
    bgColor: '#E8F4F8',
  },
  {
    id: '2',
    title: 'Visualize Your\nSpending Patterns',
    description: 'Get powerful insights with beautiful charts and analytics. See exactly where your money goes.',
    image: 'https://ik.imagekit.io/swiftChat/fintrackr/2.webp',
    bgColor: '#E8F4F8',
  },
  {
    id: '3',
    title: 'Smart Budget\nManagement',
    description: 'Set monthly budgets for categories and get alerts when approaching limits. Stay on track effortlessly.',
    image: 'https://ik.imagekit.io/swiftChat/fintrackr/3.webp',
    bgColor: '#E8F4F8',
  },
  {
    id: '4',
    title: 'Plan Ahead With\nSmart Predictions',
    description: 'AI-powered predictions help you understand your financial future and achieve your goals faster.',
    image: 'https://ik.imagekit.io/swiftChat/fintrackr/4.webp',
    bgColor: '#E8F4F8',
  },
];

export default function OnboardingPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { setHasSeenOnboarding } = useOnboardingStore();

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setHasSeenOnboarding(true);
    }
  };

  const handleSkip = () => {
    setHasSeenOnboarding(true);
  };

  const currentSlide = slides[currentIndex];

  return (
    <div className="min-h-screen max-w-2xl mx-auto">
      <OnboardingSlide
        title={currentSlide.title}
        description={currentSlide.description}
        image={currentSlide.image}
        bgColor={currentSlide.bgColor}
      />
      
      <div className="fixed bottom-0 left-0 right-0 px-8 pb-10 max-w-2xl mx-auto">
        <Paginator totalSlides={slides.length} currentIndex={currentIndex} />
        <OnboardingFooter
          currentIndex={currentIndex}
          totalSlides={slides.length}
          onSkip={handleSkip}
          onNext={handleNext}
        />
      </div>
    </div>
  );
}

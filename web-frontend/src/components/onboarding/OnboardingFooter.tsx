'use client';

import React from 'react';
import { Button } from '../shared';

interface OnboardingFooterProps {
  currentIndex: number;
  totalSlides: number;
  onSkip: () => void;
  onNext: () => void;
}

export const OnboardingFooter: React.FC<OnboardingFooterProps> = ({
  currentIndex,
  totalSlides,
  onSkip,
  onNext,
}) => {
  const isLastSlide = currentIndex === totalSlides - 1;

  return (
    <div className="flex gap-4">
      {!isLastSlide && (
        <Button
          onClick={onSkip}
          variant="outline"
          className="flex-1"
        >
          Skip
        </Button>
      )}
      <Button
        onClick={onNext}
        variant="primary"
        className={!isLastSlide ? 'flex-1' : 'w-full'}
      >
        {isLastSlide ? "Get Started" : "Next"}
      </Button>
    </div>
  );
};

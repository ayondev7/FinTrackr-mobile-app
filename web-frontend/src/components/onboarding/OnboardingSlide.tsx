'use client';

import React from 'react';
import Image from 'next/image';

interface OnboardingSlideProps {
  title: string;
  description: string;
  image: string;
  bgColor: string;
}

export const OnboardingSlide: React.FC<OnboardingSlideProps> = ({
  title,
  description,
  image,
  bgColor,
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center px-8 py-16 min-h-screen"
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex-1 flex items-center justify-center mb-8">
        <div className="relative w-64 h-64 md:w-80 md:h-80">
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
      
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 whitespace-pre-line">
          {title}
        </h2>
        <p className="text-base md:text-lg text-gray-600 leading-relaxed px-4">
          {description}
        </p>
      </div>
    </div>
  );
};

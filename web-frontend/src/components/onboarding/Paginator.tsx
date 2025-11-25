'use client';

import React from 'react';

interface PaginatorProps {
  totalSlides: number;
  currentIndex: number;
}

export const Paginator: React.FC<PaginatorProps> = ({ totalSlides, currentIndex }) => {
  return (
    <div className="flex justify-center gap-2 mb-6">
      {Array.from({ length: totalSlides }).map((_, index) => (
        <div
          key={index}
          className={`h-2 rounded-full transition-all ${
            index === currentIndex
              ? 'w-8 bg-indigo-600'
              : 'w-2 bg-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

'use client';

import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [fadeIn, setFadeIn] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    setFadeIn(true);
    
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onFinish, 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[#F8F5FF] z-50">
      <div
        className={`flex flex-col items-center transition-all duration-800 ${
          fadeIn && !fadeOut ? 'opacity-100 scale-100' : 'opacity-0 scale-80'
        }`}
      >
        <div 
          className="w-32 h-32 rounded-3xl bg-indigo-600 flex justify-center items-center mb-6"
          style={{
            boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)',
          }}
        >
          <span className="text-6xl font-bold text-white">₹</span>
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-2 tracking-wide">
          FinTrackr
        </h1>
        <p className="text-lg text-gray-600 font-semibold tracking-[0.2em]">
          Track • Analyze • Prosper
        </p>
      </div>
    </div>
  );
};

import React from 'react';
import { cn } from '@/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-md',
        onClick && 'cursor-pointer active:scale-95 transition-transform',
        className
      )}
    >
      {children}
    </div>
  );
};

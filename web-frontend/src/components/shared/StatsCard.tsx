import React from 'react';
import { cn } from '@/utils';

interface StatsCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  color?: string;
  trend?: string;
  trendUp?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color = '#6366F1',
  trend,
  trendUp,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-md">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          {title}
        </p>
        {icon && (
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            {icon}
          </div>
        )}
      </div>
      
      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {value}
      </p>
      
      {trend && (
        <p
          className={cn(
            'text-xs font-medium',
            trendUp ? 'text-green-500' : 'text-red-500'
          )}
        >
          {trend}
        </p>
      )}
    </div>
  );
};

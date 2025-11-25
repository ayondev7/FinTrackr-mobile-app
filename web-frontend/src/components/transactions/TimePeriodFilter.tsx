import React from 'react';

interface TimePeriodFilterProps {
  timePeriod: 'daily' | 'weekly' | 'monthly' | 'yearly';
  onSelect: (period: 'daily' | 'weekly' | 'monthly' | 'yearly') => void;
}

export const TimePeriodFilter: React.FC<TimePeriodFilterProps> = ({ timePeriod, onSelect }) => {
  const periods: Array<'daily' | 'weekly' | 'monthly' | 'yearly'> = ['daily', 'weekly', 'monthly', 'yearly'];
  const labels = { daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly', yearly: 'Yearly' };

  return (
    <div className="flex gap-2 mb-4">
      {periods.map((period) => (
        <button
          key={period}
          onClick={() => onSelect(period)}
          className={`flex-1 py-2 px-2 rounded-lg transition-colors ${
            timePeriod === period
              ? 'bg-indigo-600 dark:bg-indigo-500'
              : 'bg-gray-100 dark:bg-slate-700'
          }`}
        >
          <span
            className={`text-center font-medium text-xs ${
              timePeriod === period
                ? 'text-white'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            {labels[period]}
          </span>
        </button>
      ))}
    </div>
  );
};

import React from 'react';

interface TypeFilterProps {
  filterType: 'all' | 'expense' | 'revenue';
  onSelect: (type: 'all' | 'expense' | 'revenue') => void;
}

export const TypeFilter: React.FC<TypeFilterProps> = ({ filterType, onSelect }) => {
  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => onSelect('all')}
        className={`flex-1 py-2 px-4 rounded-xl transition-colors ${
          filterType === 'all'
            ? 'bg-indigo-600 dark:bg-indigo-500'
            : 'bg-gray-100 dark:bg-slate-700'
        }`}
      >
        <span
          className={`text-center font-medium ${
            filterType === 'all'
              ? 'text-white'
              : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          All
        </span>
      </button>

      <button
        onClick={() => onSelect('expense')}
        className={`flex-1 py-2 px-4 rounded-xl transition-colors ${
          filterType === 'expense'
            ? 'bg-red-500'
            : 'bg-gray-100 dark:bg-slate-700'
        }`}
      >
        <span
          className={`text-center font-medium ${
            filterType === 'expense'
              ? 'text-white'
              : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          Expenses
        </span>
      </button>

      <button
        onClick={() => onSelect('revenue')}
        className={`flex-1 py-2 px-4 rounded-xl transition-colors ${
          filterType === 'revenue'
            ? 'bg-green-500'
            : 'bg-gray-100 dark:bg-slate-700'
        }`}
      >
        <span
          className={`text-center font-medium ${
            filterType === 'revenue'
              ? 'text-white'
              : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          Revenue
        </span>
      </button>
    </div>
  );
};

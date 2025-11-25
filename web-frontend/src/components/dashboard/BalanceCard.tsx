import React from 'react';
import { formatCurrency } from '@/utils';
import { TrendingUp } from 'lucide-react';

interface BalanceCardProps {
  balance: number;
  currency: string;
  isDark: boolean;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ balance, currency, isDark }) => {
  return (
    <div 
      className="mb-6 p-6 rounded-3xl overflow-hidden relative"
      style={{
        backgroundColor: '#6366F1',
        boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)',
      }}
    >
      <div 
        className="absolute rounded-full"
        style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          width: '160px',
          height: '160px',
          right: '-40px',
          top: '-40px',
        }}
      />
      <div 
        className="absolute rounded-full"
        style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          width: '120px',
          height: '120px',
          left: '-20px',
          bottom: '-20px',
        }}
      />
      
      <div className="flex items-center justify-between mb-3 relative z-10">
        <p className="text-indigo-100 text-sm font-medium tracking-wide">
          TOTAL BALANCE
        </p>
        <div 
          className="px-3 py-1.5 rounded-full"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
        >
          <p className="text-white text-xs font-bold">
            {currency}
          </p>
        </div>
      </div>
      
      <p className="text-white text-5xl font-bold mb-4 tracking-tight relative z-10">
        {formatCurrency(balance, currency)}
      </p>
      
      <div className="flex items-center gap-2 relative z-10">
        <div 
          className="flex items-center px-3 py-1.5 rounded-full"
          style={{ backgroundColor: 'rgba(16, 185, 129, 0.25)' }}
        >
          <TrendingUp size={14} color="#10B981" />
          <p className="text-green-300 text-xs font-bold ml-1">
            +12.5%
          </p>
        </div>
        <p className="text-indigo-100 text-xs font-medium">
          vs last month
        </p>
      </div>
    </div>
  );
};

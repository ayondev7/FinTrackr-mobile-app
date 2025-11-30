import { CURRENCIES } from '../constants';

export const formatAmount = (amount: number): string => {
  return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const getCurrencySymbol = (currencyCode: string): string => {
  const currency = CURRENCIES.find(c => c.code === currencyCode);
  return currency?.symbol || '$';
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${formatAmount(amount)}`;
};

export const formatCompactNumber = (value: number, decimals = 1): string => {
  const abs = Math.abs(value);
  if (abs < 1000) return `${value}`;
  const units = [
    { value: 1e12, symbol: 'T' },
    { value: 1e9, symbol: 'B' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'K' },
  ];

  for (const unit of units) {
    if (abs >= unit.value) {
      const formatted = (value / unit.value).toFixed(decimals);
      // remove trailing .0
      const cleaned = formatted.replace(/\.0+$/, '');
      return `${cleaned}${unit.symbol}`;
    }
  }

  return `${value}`;
};

export const formatCompactCurrency = (amount: number, currency: string = 'USD', decimals = 1): string => {
  const symbol = getCurrencySymbol(currency);
  const abs = Math.abs(amount);
  if (abs < 1000) return `${symbol}${formatAmount(amount)}`;

  const units = [
    { value: 1e12, symbol: 'T' },
    { value: 1e9, symbol: 'B' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'K' },
  ];

  for (const unit of units) {
    if (abs >= unit.value) {
      const formatted = (amount / unit.value).toFixed(decimals);
      const cleaned = formatted.replace(/\.0+$/, '');
      return `${symbol}${cleaned}${unit.symbol}`;
    }
  }

  return `${symbol}${formatAmount(amount)}`;
};

export const formatDate = (dateString: string, format: 'short' | 'medium' | 'long' = 'medium'): string => {
  const date = new Date(dateString);
  
  switch (format) {
    case 'short':
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    case 'medium':
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    case 'long':
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    default:
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

export const getDateRange = (period: 'day' | 'week' | 'month' | 'year'): { start: Date; end: Date } => {
  const end = new Date();
  const start = new Date();
  
  switch (period) {
    case 'day':
      start.setHours(0, 0, 0, 0);
      break;
    case 'week':
      start.setDate(start.getDate() - 7);
      break;
    case 'month':
      start.setMonth(start.getMonth() - 1);
      break;
    case 'year':
      start.setFullYear(start.getFullYear() - 1);
      break;
  }
  
  return { start, end };
};

export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

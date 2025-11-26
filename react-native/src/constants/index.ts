export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  INR: '₹',
  AUD: 'A$',
  CAD: 'C$',
};

export const DATE_FORMATS = {
  SHORT: 'MMM DD',
  MEDIUM: 'MMM DD, YYYY',
  LONG: 'MMMM DD, YYYY',
  FULL: 'dddd, MMMM DD, YYYY',
  TIME: 'hh:mm A',
  DATETIME: 'MMM DD, YYYY hh:mm A',
};

export const TRANSACTION_TYPES = {
  EXPENSE: 'expense' as const,
  REVENUE: 'revenue' as const,
};

export const RECURRING_FREQUENCIES = {
  DAILY: 'daily' as const,
  WEEKLY: 'weekly' as const,
  MONTHLY: 'monthly' as const,
  YEARLY: 'yearly' as const,
};

export const BUDGET_PERIODS = {
  DAILY: 'daily' as const,
  WEEKLY: 'weekly' as const,
  MONTHLY: 'monthly' as const,
  YEARLY: 'yearly' as const,
};

export const PREDICTION_STATUS = {
  HEALTHY: 'healthy' as const,
  WARNING: 'warning' as const,
  CRITICAL: 'critical' as const,
};

export { ICON_OPTIONS, COLOR_OPTIONS } from './categoryOptions';
export { CURRENCIES } from './currencies';

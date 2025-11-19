export interface User {
  id: string;
  name: string;
  email?: string;
  currency: string;
  initialBalance: number;
  currentBalance: number;
  theme: 'light' | 'dark';
}

export interface Wallet {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'digital';
  balance: number;
  icon: string;
  color: string;
}

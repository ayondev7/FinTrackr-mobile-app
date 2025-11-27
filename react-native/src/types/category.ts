export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  // Use lowercase values to match `config/categories.json` and app usage
  type: 'expense' | 'revenue' | 'both';
  isPinned?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'expense' | 'revenue' | 'both';
  isPinned?: boolean;
  subCategories?: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  parentId: string;
}

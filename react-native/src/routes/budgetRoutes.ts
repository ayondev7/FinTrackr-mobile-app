const BASE = '/budget';

export const budgetRoutes = {
  list: BASE,
  create: BASE,
  getById: (id: string) => `${BASE}/${id}`,
  update: (id: string) => `${BASE}/${id}`,
  delete: (id: string) => `${BASE}/${id}`,
};

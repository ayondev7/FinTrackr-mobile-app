const BASE = '/transactions';

export const transactionRoutes = {
  list: BASE,
  create: BASE,
  stats: `${BASE}/stats`,
  getById: (id: string) => `${BASE}/${id}`,
  update: (id: string) => `${BASE}/${id}`,
  delete: (id: string) => `${BASE}/${id}`,
};

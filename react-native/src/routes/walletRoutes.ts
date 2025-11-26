const BASE = '/wallet';

export const walletRoutes = {
  list: BASE,
  create: BASE,
  getById: (id: string) => `${BASE}/${id}`,
  update: (id: string) => `${BASE}/${id}`,
  delete: (id: string) => `${BASE}/${id}`,
};

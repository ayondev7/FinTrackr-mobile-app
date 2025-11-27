import { config } from '../config';

export const API_BASE_URL = `${config.apiBaseUrl}/api`;

export { authRoutes } from './authRoutes';
export { userRoutes } from './userRoutes';
export { transactionRoutes } from './transactionRoutes';
export { categoryRoutes } from './categoryRoutes';
export { budgetRoutes } from './budgetRoutes';
export { analyticsRoutes } from './analyticsRoutes';
export { dashboardRoutes } from './dashboardRoutes';
export { predictionRoutes } from './predictionRoutes';

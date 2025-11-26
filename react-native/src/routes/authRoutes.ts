import { API_BASE_URL } from './index';

export const authRoutes = {
  googleLogin: `${API_BASE_URL}/auth/google`,
  login: `${API_BASE_URL}/auth/login`,
  register: `${API_BASE_URL}/auth/register`,
  logout: `${API_BASE_URL}/auth/logout`,
  refreshToken: `${API_BASE_URL}/auth/refresh`,
  verifyToken: `${API_BASE_URL}/auth/verify`,
  forgotPassword: `${API_BASE_URL}/auth/forgot-password`,
  resetPassword: `${API_BASE_URL}/auth/reset-password`,
};

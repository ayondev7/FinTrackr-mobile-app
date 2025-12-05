import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { config } from "../config";
import { getTokens, saveTokens, clearTokens } from "./authStorage";

interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

export const apiClient = axios.create({
  baseURL: `${config.apiBaseUrl}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout:90000,
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const { accessToken } = await getTokens();
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { refreshToken } = await getTokens();

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post(
          `${config.apiBaseUrl}/api/auth/refresh`,
          {
            refreshToken,
          }
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data.data;

        await saveTokens(newAccessToken, newRefreshToken);

        processQueue(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        await clearTokens();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.code === "ECONNABORTED") {
      console.error("Request timeout");
    } else if (error.code === "ERR_NETWORK") {
      console.error("Network error - check if backend is running");
    }

    try {
      const serverData =
        (error.response && (error.response.data as any)) || null;
      const serverErrorMessage =
        serverData?.error || serverData?.message || null;
      if (serverErrorMessage) {
        (error as any).message = serverErrorMessage;
      }
    } catch (e) {
     
    }

    return Promise.reject(error);
  }
);

export const apiRequest = {
  get: <T>(url: string, params?: object) =>
    apiClient.get<T>(url, { params }).then((res) => res.data),

  post: <T>(url: string, data?: object) =>
    apiClient.post<T>(url, data).then((res) => res.data),

  put: <T>(url: string, data?: object) =>
    apiClient.put<T>(url, data).then((res) => res.data),

  patch: <T>(url: string, data?: object) =>
    apiClient.patch<T>(url, data).then((res) => res.data),

  delete: <T>(url: string) => apiClient.delete<T>(url).then((res) => res.data),
};

export default apiClient;

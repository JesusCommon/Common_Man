import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store";
import type { ApiErrorResponse } from "./types";

export function setupRequestInterceptor(client: AxiosInstance): void {
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = useAuthStore.getState().accessToken;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      if (import.meta.env.DEV) {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );
}

export function setupResponseInterceptor(client: AxiosInstance): void {
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError<ApiErrorResponse>) => {
      if (import.meta.env.DEV) {
        console.error("[API Error]", {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      }
      // ❌ Eliminado: logout automático en 401
      return Promise.reject(error);
    }
  );
}
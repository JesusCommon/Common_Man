import type { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from "axios";
import { useAuthStore } from "@/store";
import type { ApiErrorResponse } from "./types";

export function setupRequestInterceptor(client: AxiosInstance): void {
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = useAuthStore.getState().accessToken;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );
}

export function setupResponseInterceptor(client: AxiosInstance): void {
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiErrorResponse>) => {
      return Promise.reject(error);
    }
  );
}
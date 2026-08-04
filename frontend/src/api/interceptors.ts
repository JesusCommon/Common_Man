import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import type { ApiErrorResponse } from "./types";


export function setupRequestInterceptor(client: AxiosInstance): void {
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (import.meta.env.DEV) {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
      }

      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );
}

export function setupResponseInterceptor(client: AxiosInstance): void {
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError<ApiErrorResponse>) => {
      if (import.meta.env.DEV) {
        console.error("[API Error]", {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      }

      return Promise.reject(error);
    }
  );
}
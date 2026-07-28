import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { axiosInstance } from '../api/client/axios';
import { useAuthStore } from '../store/auth.store';

function getAuthToken(): string | null {
  return useAuthStore.getState().accessToken;
}

function onRequest(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  const token = getAuthToken();

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
}

function onRequestError(error: AxiosError): Promise<never> {
  return Promise.reject(error);
}

function onResponse(response: AxiosResponse): AxiosResponse {
  return response;
}

function onResponseError(error: AxiosError): Promise<never> {
  return Promise.reject(error);
}

export function registerInterceptors(): void {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
}
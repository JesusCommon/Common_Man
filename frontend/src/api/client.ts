import axios from "axios";
import { API_CONFIG } from "./config";
import { setupRequestInterceptor, setupResponseInterceptor } from "./interceptors";

export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
  withCredentials: API_CONFIG.WITH_CREDENTIALS,
});

setupRequestInterceptor(apiClient);
setupResponseInterceptor(apiClient);

export const http = {
  get: apiClient.get.bind(apiClient),
  post: apiClient.post.bind(apiClient),
  put: apiClient.put.bind(apiClient),
  patch: apiClient.patch.bind(apiClient),
  delete: apiClient.delete.bind(apiClient),
} as const;
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store";

type RetryFn = (token: string | null) => void;
let refreshPromise: Promise<boolean> | null = null;
const retryQueue: Array<{
  resolve: RetryFn;
  reject: (err: unknown) => void;
}> = [];

function flushQueue(token: string | null, error: unknown = null) {
  retryQueue.forEach((cb) => {
    if (error) cb.reject(error);
    else cb.resolve(token);
  });
  retryQueue.length = 0;
}

export function setupRequestInterceptor(instance: AxiosInstance) {
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

export function setupResponseInterceptor(instance: AxiosInstance) {
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      // ⭐ Solo maneja 401
      if (!originalRequest || error.response?.status !== 401) {
        return Promise.reject(error);
      }

      const url = originalRequest.url ?? "";
      
      // ⭐ Evita refresh para endpoints de autenticación
      if (url.includes("/auth/login") || url.includes("/auth/refresh")) {
        console.warn("401 en endpoint de auth, haciendo logout");
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      // ⭐ Evita reintentar el mismo request dos veces
      if (originalRequest._retry) {
        console.warn("Request ya reintentado, rechazando");
        return Promise.reject(error);
      }

      // ⭐ Si ya hay un refresh en curso, encola este request
      if (refreshPromise) {
        console.log("Refresh en curso, encolando request");
        return new Promise((resolve, reject) => {
          retryQueue.push({
            resolve: (token) => {
              if (token) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(instance(originalRequest));
              } else {
                reject(error);
              }
            },
            reject,
          });
        });
      }

      console.log("Iniciando refresh de token");
      originalRequest._retry = true;
      refreshPromise = useAuthStore.getState().refreshAccessToken();

      try {
        const ok = await refreshPromise;
        refreshPromise = null;

        if (!ok) {
          console.error("Refresh falló, haciendo logout");
          flushQueue(null, error);
          return Promise.reject(error);
        }

        const newToken = useAuthStore.getState().accessToken;
        console.log("Refresh exitoso, reintentando request");
        flushQueue(newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        console.error("Error en refresh:", refreshError);
        refreshPromise = null;
        flushQueue(null, refreshError);
        return Promise.reject(refreshError);
      }
    }
  );
}
import { axiosInstance } from './axios';
import { registerInterceptors } from './interceptors';

registerInterceptors();

export const fetchClient = axiosInstance;

export type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
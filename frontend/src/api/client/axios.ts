import axios, { type AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT ?? 10000);

if (!API_BASE_URL) {
  // eslint-disable-next-line no-console
  console.warn(
    '[axios] VITE_API_BASE_URL no está definida. Verifica tu archivo .env',
  );
}

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
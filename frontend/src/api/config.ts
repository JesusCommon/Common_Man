export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  TIMEOUT: 30000,
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  } as const,
  WITH_CREDENTIALS: true,
} as const;

export const RETRYABLE_STATUS_CODES = new Set([408, 429, 502, 503, 504]);
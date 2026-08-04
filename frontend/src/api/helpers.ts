import { API_CONFIG } from "./config";
import type { ApiErrorResponse } from "./types";

export function buildUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const cleanBase = API_CONFIG.BASE_URL.replace(/\/+$/, "");
  return `${cleanBase}${cleanPath}`;
}

export function buildQueryString(
  params: Record<string, string | number | boolean | string[] | undefined>
): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    
    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, String(v)));
    } else {
      searchParams.append(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export async function parseApiError(response: Response): Promise<ApiErrorResponse> {
  try {
    const data = await response.json();
    return {
      message: data.message || "Error desconocido del servidor",
      code: data.code,
      errors: data.errors,
      timestamp: data.timestamp || new Date().toISOString(),
    };
  } catch {
    return {
      message: `Error HTTP ${response.status}: ${response.statusText}`,
      timestamp: new Date().toISOString(),
    };
  }
}

export function interpolatePath<T extends Record<string, string>>(
  path: string,
  params: T
): string {
  return path.replace(/:([a-zA-Z]+)/g, (_, key) => {
    const value = params[key];
    if (!value) throw new Error(`Missing path param: ${key}`);
    return encodeURIComponent(value);
  });
}
import { API_CONFIG } from "./config";

export function buildUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const cleanBase = API_CONFIG.BASE_URL.replace(/\/+$/, "");
  return `${cleanBase}${cleanPath}`;
}

export function buildQueryString(
  params: Record<string, string | number | boolean | string[] | null | undefined>
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

export function interpolatePath<T extends Record<string, string | number>>(
  path: string,
  params: T
): string {
  return path.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
    const value = params[key];
    if (value === undefined) throw new Error(`Missing path param: ${key}`);
    return encodeURIComponent(String(value));
  });
}
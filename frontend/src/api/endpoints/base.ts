export const API_PREFIXES = {
  USUARIOS: '/usuarios',
  AUTH: '/auth',
} as const;

export type ApiPrefix = (typeof API_PREFIXES)[keyof typeof API_PREFIXES];

export function buildPath(prefix: ApiPrefix, segment = ''): string {
  if (!segment) return prefix;
  return `${prefix}${segment.startsWith('/') ? segment : `/${segment}`}`;
}
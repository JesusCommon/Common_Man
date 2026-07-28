import { API_PREFIXES, buildPath } from './base';

const PREFIX = API_PREFIXES.AUTH;

export const authEndpoints = {
  login: (): string => buildPath(PREFIX, '/login'),
  refrescar: (): string => buildPath(PREFIX, '/refresh'),
  logout: (): string => buildPath(PREFIX, '/logout'),
} as const;
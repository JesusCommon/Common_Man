export interface ApiErrorResponse {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
  timestamp: string;
}

export interface RespuestaConMensaje<T = unknown> {
  mensaje: string;
  data: T;
}

export interface Paginado<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

export interface PaginationParams {
  skip?: number;
  limit?: number;
}
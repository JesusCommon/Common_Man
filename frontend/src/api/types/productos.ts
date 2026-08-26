export interface ProductoCreate {
  nombre: string;
  slug?: string;
  descripcion?: string;
  descripcion_breve?: string;
  precio: number;
  stock?: number;
  imagen?: string;
  categoria_id: string;
}

export interface ProductoUpdate {
  nombre?: string;
  slug?: string;
  descripcion?: string;
  descripcion_breve?: string;
  precio?: number;
  stock?: number;
  imagen?: string;
  categoria_id?: string;
}

export interface ProductoStockUpdate {
  delta: number;
}

export interface ProductoPublicResponse {
  id: string;
  nombre: string;
  slug: string;
  descripcion_breve?: string;
  precio: number;
  stock: number;
  imagen?: string;
  categoria_id: string;
  activo: boolean;
}

export interface ProductoAdminResponse {
  id: string;
  nombre: string;
  slug: string;
  descripcion?: string;
  descripcion_breve?: string;
  precio: number;
  stock: number;
  imagen?: string;
  categoria_id: string;
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}
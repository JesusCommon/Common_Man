export interface GeneroCreate {
  nombre: string;
  descripcion?: string;
}

export interface GeneroUpdate {
  nombre?: string;
  descripcion?: string;
}

export interface GeneroResponse {
  id: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface GeneroPublicResponse {
    id: string;
    nombre: string;
    slug: string;
}
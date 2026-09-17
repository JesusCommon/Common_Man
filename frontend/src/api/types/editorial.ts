export interface EditorialCreate {
  nombre: string;
  descripcion?: string;
}

export interface EditorialUpdate {
  nombre?: string;
  descripcion?: string;
}

export interface EditorialResponse {
  id: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface EditorialPublicResponse {
    id: string;
    nombre: string;
    slug: string;
}
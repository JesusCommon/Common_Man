export interface AutorCreate {
  nombre: string;
  apellido: string;
  pais_nacimiento?: string;
}

export interface AutorUpdate {
  nombre?: string;
  apellido?: string;
  pais_nacimiento?: string;
}

export interface AutorResponse {
  id: string;
  nombre: string;
  apellido: string;
  pais_nacimiento?: string;
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface AutorPublicResponse {
  id: string;
  nombre: string;
  apellido: string;
  slug: string;
  pais_nacimiento?: string;
}
export type Idiomas = "Español" | "Ingles" | "Portugues";

export interface LibroCreate {
  nombre: string;
  autor_id: string;
  editorial_id: string;
  genero_id: string;
  edicion?: string;
  anio_publicacion: number;
  paginas: number;
  idioma: Idiomas;
  portada?: string;
  isbn?: string;
  sku?: string;
  precio: string;
  stock: number;
  descripcion?: string;
  contenido: string;
}

export interface LibroUpdate {
  nombre?: string;
  autor_id?: string;
  editorial_id?: string;
  genero_id?: string;
  edicion?: string;
  anio_publicacion?: number;
  paginas?: number;
  idioma?: Idiomas;
  portada?: string;
  isbn?: string;
  sku?: string;
  precio?: string;
  stock?: number;
  descripcion?: string;
  contenido?: string;
  activo?: boolean;
}

export interface LibroResponse {
  id: string;
  nombre: string;
  autor_id: string;
  editorial_id: string;
  genero_id: string;
  edicion?: string;
  anio_publicacion: number;
  paginas: number;
  idioma: Idiomas;
  portada?: string;
  isbn?: string;
  sku?: string;
  precio: string;
  stock: number;
  descripcion?: string;
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface LibroAdminResponse extends LibroResponse {
  contenido: string;
}

export interface LibroContenidoResponse {
  id: string;
  nombre: string;
  contenido: string;
}
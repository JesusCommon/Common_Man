export interface DireccionCreate {
  alias: string;
  nombre_destinatario: string;
  telefono: string;
  direccion: string;
  complemento?: string;
  barrio?: string;
  ciudad: string;
  departamento: string;
  codigo_postal?: string;
  pais?: string;
  referencias?: string;
  es_predeterminada?: boolean;
}

export type DireccionUpdate = Partial<DireccionCreate>;

export interface DireccionResponse {
  id: string;
  alias: string;
  nombre_destinatario: string;
  telefono: string;
  direccion: string;
  complemento: string | null;
  barrio: string | null;
  ciudad: string;
  departamento: string;
  codigo_postal: string | null;
  pais: string;
  referencias: string | null;
  es_predeterminada: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface DireccionAdminResponse extends DireccionResponse {
  usuario_id: string;
  activo: boolean;
}
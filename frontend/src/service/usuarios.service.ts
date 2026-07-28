import { fetchClient } from '../api/client/fetchClient';
import { usuariosEndpoints } from '../api/endpoints';
import type {
  Usuario,
  UsuarioCambiarPassword,
  UsuarioCreate,
  UsuarioRecargarSaldo,
  UsuarioUpdate,
} from '../types';


async function ejecutar<T>(operacion: string, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error(`[usuarios.service] Error en "${operacion}":`, error);
    throw error;
  }
}

export interface BuscarUsuariosParams {
  [clave: string]: string | number | boolean | undefined;
}

export async function crearUsuario(payload: UsuarioCreate): Promise<Usuario> {
  return ejecutar('crearUsuario', async () => {
    const response = await fetchClient.post<Usuario>(
      usuariosEndpoints.crear(),
      payload,
    );
    return response.data;
  });
}

export async function obtenerUsuarios(): Promise<Usuario[]> {
  return ejecutar('obtenerUsuarios', async () => {
    const response = await fetchClient.get<Usuario[]>(
      usuariosEndpoints.listarTodos(),
    );
    return response.data;
  });
}

export async function obtenerUsuariosActivos(): Promise<Usuario[]> {
  return ejecutar('obtenerUsuariosActivos', async () => {
    const response = await fetchClient.get<Usuario[]>(
      usuariosEndpoints.listarActivos(),
    );
    return response.data;
  });
}

export async function obtenerUsuariosInactivos(): Promise<Usuario[]> {
  return ejecutar('obtenerUsuariosInactivos', async () => {
    const response = await fetchClient.get<Usuario[]>(
      usuariosEndpoints.listarInactivos(),
    );
    return response.data;
  });
}

export async function obtenerPerfil(): Promise<Usuario> {
  return ejecutar('obtenerPerfil', async () => {
    const response = await fetchClient.get<Usuario>(
      usuariosEndpoints.obtenerPerfil(),
    );
    return response.data;
  });
}

export async function actualizarPerfil(payload: UsuarioUpdate): Promise<Usuario> {
  return ejecutar('actualizarPerfil', async () => {
    const response = await fetchClient.put<Usuario>(
      usuariosEndpoints.actualizarPerfil(),
      payload,
    );
    return response.data;
  });
}

export async function cambiarPassword(
  payload: UsuarioCambiarPassword,
): Promise<Usuario> {
  return ejecutar('cambiarPassword', async () => {
    const response = await fetchClient.patch<Usuario>(
      usuariosEndpoints.actualizarPassword(),
      payload,
    );
    return response.data;
  });
}

export async function recargarSaldo(
  payload: UsuarioRecargarSaldo,
): Promise<Usuario> {
  return ejecutar('recargarSaldo', async () => {
    const response = await fetchClient.patch<Usuario>(
      usuariosEndpoints.actualizarSaldo(),
      payload,
    );
    return response.data;
  });
}

export async function buscarUsuarios(
  params?: BuscarUsuariosParams,
): Promise<Usuario[]> {
  return ejecutar('buscarUsuarios', async () => {
    const response = await fetchClient.get<Usuario[]>(
      usuariosEndpoints.buscar(),
      { params },
    );
    return response.data;
  });
}

export async function buscarUsuariosAdmin(
  params?: BuscarUsuariosParams,
): Promise<Usuario[]> {
  return ejecutar('buscarUsuariosAdmin', async () => {
    const response = await fetchClient.get<Usuario[]>(
      usuariosEndpoints.buscarAdmin(),
      { params },
    );
    return response.data;
  });
}

export async function obtenerUsuarioPorId(
  id: string | number,
): Promise<Usuario> {
  return ejecutar('obtenerUsuarioPorId', async () => {
    const response = await fetchClient.get<Usuario>(
      usuariosEndpoints.obtenerPorId(id),
    );
    return response.data;
  });
}

export async function obtenerUsuarioPorUuid(uuid: string): Promise<Usuario> {
  return ejecutar('obtenerUsuarioPorUuid', async () => {
    const response = await fetchClient.get<Usuario>(
      usuariosEndpoints.obtenerPorUuid(uuid),
    );
    return response.data;
  });
}

export async function activarUsuario(id: string | number): Promise<Usuario> {
  return ejecutar('activarUsuario', async () => {
    const response = await fetchClient.patch<Usuario>(
      usuariosEndpoints.activar(id),
    );
    return response.data;
  });
}

export async function desactivarUsuario(id: string | number): Promise<Usuario> {
  return ejecutar('desactivarUsuario', async () => {
    const response = await fetchClient.patch<Usuario>(
      usuariosEndpoints.desactivar(id),
    );
    return response.data;
  });
}
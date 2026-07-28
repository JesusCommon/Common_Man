import { useCallback, useEffect } from 'react';
import { useAsync } from './common/useAsync';
import { useFetch } from './common/useFetch';
import * as usuariosService from '../service/usuarios.service';
import type { BuscarUsuariosParams } from '../service/usuarios.service';
import { useAuthStore } from '../store/auth.store';
import type {
  Usuario,
  UsuarioCambiarPassword,
  UsuarioCreate,
  UsuarioRecargarSaldo,
  UsuarioUpdate,
} from '../types';

export function useUsuarios() {
  return useFetch<Usuario[]>(usuariosService.obtenerUsuarios, []);
}

export function useUsuariosActivos() {
  return useFetch<Usuario[]>(usuariosService.obtenerUsuariosActivos, []);
}

export function useUsuariosInactivos() {
  return useFetch<Usuario[]>(usuariosService.obtenerUsuariosInactivos, []);
}

export function usePerfil() {
  const query = useFetch<Usuario>(usuariosService.obtenerPerfil, []);
  const setUsuario = useAuthStore((state) => state.setUsuario);

  useEffect(() => {
    if (query.data) {
      setUsuario(query.data);
    }
  }, [query.data, setUsuario]);

  return query;
}

export function useUsuario(id: string | number | undefined) {
  return useFetch<Usuario>(
    () => usuariosService.obtenerUsuarioPorId(id as string | number),
    [id],
    { enabled: id !== undefined },
  );
}
export function useUsuarioPorUuid(uuid: string | undefined) {
  return useFetch<Usuario>(
    () => usuariosService.obtenerUsuarioPorUuid(uuid as string),
    [uuid],
    { enabled: uuid !== undefined },
  );
}

export function useCrearUsuario() {
  return useAsync<Usuario, [UsuarioCreate]>(usuariosService.crearUsuario);
}

export function useActualizarPerfil() {
  const { execute, ...rest } = useAsync<Usuario, [UsuarioUpdate]>(
    usuariosService.actualizarPerfil,
  );
  const setUsuario = useAuthStore((state) => state.setUsuario);

  const actualizar = useCallback(
    async (payload: UsuarioUpdate): Promise<Usuario> => {
      const usuario = await execute(payload);
      setUsuario(usuario);
      return usuario;
    },
    [execute, setUsuario],
  );

  return { ...rest, execute: actualizar };
}

export function useCambiarPassword() {
  return useAsync<Usuario, [UsuarioCambiarPassword]>(
    usuariosService.cambiarPassword,
  );
}

export function useRecargarSaldo() {
  return useAsync<Usuario, [UsuarioRecargarSaldo]>(
    usuariosService.recargarSaldo,
  );
}

export function useBuscarUsuarios() {
  return useAsync<Usuario[], [BuscarUsuariosParams?]>(
    usuariosService.buscarUsuarios,
  );
}

export function useBuscarUsuariosAdmin() {
  return useAsync<Usuario[], [BuscarUsuariosParams?]>(
    usuariosService.buscarUsuariosAdmin,
  );
}

export function useActivarUsuario() {
  return useAsync<Usuario, [string | number]>(usuariosService.activarUsuario);
}

export function useDesactivarUsuario() {
  return useAsync<Usuario, [string | number]>(
    usuariosService.desactivarUsuario,
  );
}
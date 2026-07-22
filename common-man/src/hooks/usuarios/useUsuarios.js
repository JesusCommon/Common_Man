import { useCallback } from "react";
import { usuarioService } from "../../services/usuarios.service";
import { useResourceList } from "../factories/useResourceList";

export function useUsuarios() {
  const fetchFn = useCallback(() => usuarioService.listar(), []);
  const { data, loading, error, recargar } = useResourceList(fetchFn);

  return { usuarios: data, loading, error, recargar };
}
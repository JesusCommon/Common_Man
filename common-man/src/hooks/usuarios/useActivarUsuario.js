import { usuarioService } from "../../services/usuarios.service";
import { useResourceMutation } from "../factories/useResourceMutation";

export function useActivarUsuario() {
  const { ejecutar, loading, errorApi } = useResourceMutation(
    (id) => usuarioService.activar(id)
  );

  return { activar: ejecutar, loading, errorApi };
}
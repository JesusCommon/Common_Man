import { usuarioService } from "../../services/usuarios.service";
import { useResourceMutation } from "../factories/useResourceMutation";

export function useDesactivarUsuario() {
  const { ejecutar, loading, errorApi } = useResourceMutation(
    (id) => usuarioService.desactivar(id)
  );

  return { desactivar: ejecutar, loading, errorApi };
}
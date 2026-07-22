import { usuarioService } from "../../services/usuarios.service";
import { usuarioCreateSchema } from "../../validations/usuarios/usuarios.schema";
import { useResourceMutation } from "../factories/useResourceMutation";

export function useCrearUsuario() {
  const { ejecutar, loading, errores, errorApi } = useResourceMutation(
    (data) => usuarioService.crear(data),
    usuarioCreateSchema
  );

  return { crear: ejecutar, loading, errores, errorApi };
}
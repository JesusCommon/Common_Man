import { usuarioService } from "../../services/usuarios.service";
import { usuarioUpdateSchema } from "../../validations/usuarios/usuarios.schema";
import { useResourceMutation } from "../factories/useResourceMutation";

export function useActualizarUsuario() {
  const { ejecutar, loading, errores, errorApi } = useResourceMutation(
    (data) => usuarioService.actualizar(data.__id, data),
    usuarioUpdateSchema
  );

  const actualizar = (id, formData) => ejecutar({ ...formData, __id: id });

  return { actualizar, loading, errores, errorApi };
}
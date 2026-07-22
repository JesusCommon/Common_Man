import { usuarioService } from "../../services/usuarios.service";
import { usuarioCambiarPasswordSchema } from "../../validations/usuarios/usuarios.schema";
import { useResourceMutation } from "../factories/useResourceMutation";

export function useCambiarPassword() {
  const { ejecutar, loading, errores, errorApi } = useResourceMutation(
    (data) => usuarioService.cambiarPassword(data.__id, data),
    usuarioCambiarPasswordSchema
  );

  const cambiarPassword = (id, formData) => ejecutar({ ...formData, __id: id });

  return { cambiarPassword, loading, errores, errorApi };
}
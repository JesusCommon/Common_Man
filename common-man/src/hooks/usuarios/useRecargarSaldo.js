import { usuarioService } from "../../services/usuarios.service";
import { usuarioRecargarSaldoSchema } from "../../validations/usuarios/usuarios.schema";
import { useResourceMutation } from "../factories/useResourceMutation";

export function useRecargarSaldo() {
  const { ejecutar, loading, errores, errorApi } = useResourceMutation(
    (data) => usuarioService.recargarSaldo(data.__id, data),
    usuarioRecargarSaldoSchema
  );

  const recargarSaldo = (id, formData) => ejecutar({ ...formData, __id: id });

  return { recargarSaldo, loading, errores, errorApi };
}
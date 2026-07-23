import { productoService } from "../../services/productos.service";
import { productoUpdateSchema } from "../../validations/productos/productos.schema";
import { useResourceMutation } from "../factories/useResourceMutation";

export function useActualizarProducto() {
  const { ejecutar, loading, errores, errorApi } = useResourceMutation(
    (data) => productoService.actualizar(data.__id, data),
    productoUpdateSchema
  );

  const actualizar = (id, formData) => ejecutar({ ...formData, __id: id });

  return { actualizar, loading, errores, errorApi };
}
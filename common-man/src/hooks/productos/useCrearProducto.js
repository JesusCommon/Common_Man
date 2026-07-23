import { productoCreateSchema } from "../../validations/productos/productos.schema";
import { useResourceMutation } from "../factories/useResourceMutation";
import { productoService } from "../../services/productos.service";

export function useCrearProducto() {
  const { ejecutar, loading, errores, errorApi } = useResourceMutation(
    (data) => productoService.crear(data),
    productoCreateSchema
  );

  return { crear: ejecutar, loading, errores, errorApi };
}
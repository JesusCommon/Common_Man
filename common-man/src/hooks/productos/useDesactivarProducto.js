import { productoService } from "../../services/productos.service";
import { useResourceMutation } from "../factories/useResourceMutation";

export function useDesactivarProducto() {
  const { ejecutar, loading, errorApi } = useResourceMutation(
    (id) => productoService.desactivar(id)
  );

  return { desactivar: ejecutar, loading, errorApi };
}
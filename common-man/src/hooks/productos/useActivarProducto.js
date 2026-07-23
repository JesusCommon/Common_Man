import { productoService } from "../../services/productos.service";
import { useResourceMutation } from "../factories/useResourceMutation";

export function useActivarProducto() {
  const { ejecutar, loading, errorApi } = useResourceMutation(
    (id) => productoService.activar(id)
  );

  return { activar: ejecutar, loading, errorApi };
}
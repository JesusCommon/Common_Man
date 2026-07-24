import { categoriaLibroService } from "../../services/categoriaLibro.service";
import { categoriaProductoService } from "../../services/categoriaProducto.service";
import { useResourceMutation } from "../factories/useResourceMutation";

export function useActivarCategoriaLibro() {
  const { ejecutar, loading, errorApi } = useResourceMutation(
    (id) => categoriaLibroService.activar(id)
  );

  return { activar: ejecutar, loading, errorApi };
}

export function useActivarCategoriaProducto() {
  const { ejecutar, loading, errorApi } = useResourceMutation(
    (id) => categoriaProductoService.activar(id)
  );

  return { activar: ejecutar, loading, errorApi };
}

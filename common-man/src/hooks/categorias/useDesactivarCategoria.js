import { categoriasLibroService } from "../../services/categoriaLibro.service";
import { categoriaProductoService } from "../../services/categoriaProducto.service";
import { useResourceMutation } from "../factories/useResourceMutation";

export function useDesactivarCategoriaLibro() {
  const { ejecutar, loading, errorApi } = useResourceMutation(
    (id) => categoriasLibroService.desactivar(id)
  );

  return { desactivar: ejecutar, loading, errorApi };
}

export function useDesactivarCategoriaProducto() {
  const { ejecutar, loading, errorApi } = useResourceMutation(
    (id) => categoriaProductoService.desactivar(id)
  );

  return { desactivar: ejecutar, loading, errorApi };
}

import { categoriasLibroService } from "../../services/categoriaLibro.service";
import { categoriasTiendaService } from "../../services/categoriasTienda.service";
import { useResourceMutation } from "../factories/useResourceMutation";

export function useDesactivarCategoriaLibro() {
  const { ejecutar, loading, errorApi } = useResourceMutation(
    (id) => categoriasLibroService.desactivar(id)
  );

  return { desactivar: ejecutar, loading, errorApi };
}

export function useDesactivarCategoriaTienda() {
  const { ejecutar, loading, errorApi } = useResourceMutation(
    (id) => categoriasTiendaService.desactivar(id)
  );

  return { desactivar: ejecutar, loading, errorApi };
}

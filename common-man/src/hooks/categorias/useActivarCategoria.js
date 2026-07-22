import { categoriasLibroService } from "../../services/categoriaLibro.service";
import { categoriasTiendaService } from "../../services/categoriasTienda.service";
import { useResourceMutation } from "../factories/useResourceMutation";

export function useActivarCategoriaLibro() {
  const { ejecutar, loading, errorApi } = useResourceMutation(
    (id) => categoriasLibroService.activar(id)
  );

  return { activar: ejecutar, loading, errorApi };
}

export function useActivarCategoriaTienda() {
  const { ejecutar, loading, errorApi } = useResourceMutation(
    (id) => categoriasTiendaService.activar(id)
  );

  return { activar: ejecutar, loading, errorApi };
}

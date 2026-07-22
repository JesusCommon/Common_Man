import { useCallback } from "react";
import { categoriasLibroService } from "../../services/categoriaLibro.service";
import { categoriasTiendaService } from "../../services/categoriasTienda.service"
import { useResourceList } from "../factories/useResourceList";

export function useCategoriasLibros() {
  const fetchFn = useCallback(() => categoriasLibroService.listar(), []);
  const { data, loading, error, recargar } = useResourceList(fetchFn);

  return { categorias: data, loading, error, recargar };
}

export function useCategoriasTienda() {
    const fetchFn = useCallback(() => categoriasTiendaService.listar(), []);
    const { data, loading, error, recargar } = useResourceList(fetchFn);

    return {categorias: data, loading, error, recargar}
}
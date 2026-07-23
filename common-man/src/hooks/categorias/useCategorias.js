import { useCallback } from "react";
import { categoriasLibroService } from "../../services/categoriaLibro.service";
import { categoriaProductoService } from "../../services/categoriaProducto.service"
import { useResourceList } from "../factories/useResourceList";

export function useCategoriaLibro() {
  const fetchFn = useCallback(() => categoriasLibroService.listar(), []);
  const { data, loading, error, recargar } = useResourceList(fetchFn);

  return { categorias: data, loading, error, recargar };
}

export function useCategoriaProducto() {
    const fetchFn = useCallback(() => categoriaProductoService.listar(), []);
    const { data, loading, error, recargar } = useResourceList(fetchFn);

    return {categorias: data, loading, error, recargar}
}
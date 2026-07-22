import { useCallback } from "react";
import { librosService } from "../../services/libros.service";
import { useResourceList } from "../factories/useResourceList";

export function useLibros() {
  const fetchFn = useCallback(() => librosService.listar(), []);
  const { data, loading, error, recargar } = useResourceList(fetchFn);

  return { libros: data, loading, error, recargar };
}
import { libroService } from "../../services/libros.service";
import { useResourceMutation } from "../factories/useResourceMutation";

export function useDesactivarLibro() {
  const { ejecutar, loading, errorApi } = useResourceMutation(
    (id) => libroService.desactivar(id)
  );

  return { desactivar: ejecutar, loading, errorApi };
}
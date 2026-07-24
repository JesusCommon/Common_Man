import { libroService } from "../../services/libros.service";
import { useResourceMutation } from "../factories/useResourceMutation";

export function useActivarLibro() {
  const { ejecutar, loading, errorApi } = useResourceMutation(
    (id) => libroService.activar(id)
  );

  return { activar: ejecutar, loading, errorApi };
}
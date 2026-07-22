import { librosService } from "../../services/libros.service";
import { useResourceMutation } from "../factories/useResourceMutation";

export function useActivarLibro() {
  const { ejecutar, loading, errorApi } = useResourceMutation(
    (id) => librosService.activar(id)
  );

  return { activar: ejecutar, loading, errorApi };
}
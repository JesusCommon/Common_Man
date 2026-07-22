import { librosService } from "../../services/libros.service";
import { useResourceMutation } from "../factories/useResourceMutation";

export function useDesactivarLibro() {
  const { ejecutar, loading, errorApi } = useResourceMutation(
    (id) => librosService.desactivar(id)
  );

  return { desactivar: ejecutar, loading, errorApi };
}
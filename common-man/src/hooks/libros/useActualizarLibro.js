import { librosService } from "../../services/libros.service";
import { libroUpdateSchema } from "../../validations/libros/libros.schema";
import { useResourceMutation } from "../factories/useResourceMutation";

export function useActualizarLibro() {
  const { ejecutar, loading, errores, errorApi } = useResourceMutation(
    (data) => librosService.actualizar(data.__id, data),
    libroUpdateSchema
  );

  const actualizar = (id, formData) => ejecutar({ ...formData, __id: id });

  return { actualizar, loading, errores, errorApi };
}
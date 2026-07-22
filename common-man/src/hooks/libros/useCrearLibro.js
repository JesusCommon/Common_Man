import { libroCreateSchema } from "../../validations/libros/libros.schema";
import { useResourceMutation } from "../factories/useResourceMutation";
import { librosService } from "../../services/libros.service";

export function useCrearLibro() {
  const { ejecutar, loading, errores, errorApi } = useResourceMutation(
    (data) => librosService.crear(data),
    libroCreateSchema
  );

  return { crear: ejecutar, loading, errores, errorApi };
}
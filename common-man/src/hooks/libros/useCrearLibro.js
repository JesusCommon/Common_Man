import { libroCreateSchema } from "../../validations/libros/libros.schema";
import { useResourceMutation } from "../factories/useResourceMutation";
import { libroService } from "../../services/libros.service";

export function useCrearLibro() {
  const { ejecutar, loading, errores, errorApi } = useResourceMutation(
    (data) => libroService.crear(data),
    libroCreateSchema
  );

  return { crear: ejecutar, loading, errores, errorApi };
}
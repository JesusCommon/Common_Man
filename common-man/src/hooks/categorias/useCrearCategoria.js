import { categoriasLibroService } from "../../services/categoriaLibro.service";
import { categoriasTiendaService } from "../../services/categoriasTienda.service";
import { categoriaTiendaCreateSchema } from "../../validations/categorias/categoriaTienda.schema";
import { categoriaLibroCreateSchema } from "../../validations/categorias/categoriaLibro.schema";
import { useResourceMutation } from "../factories/useResourceMutation";

export function useCrearCategoriaLibro() {
  const { ejecutar, loading, errores, errorApi } = useResourceMutation(
    (data) => categoriasLibroService.crear(data),
    categoriaLibroCreateSchema
  );

  return { crear: ejecutar, loading, errores, errorApi };
}

export function useCrearCategoriaTienda() {
  const { ejecutar, loading, errores, errorApi } = useResourceMutation(
    (data) => categoriasTiendaService.crear(data),
    categoriaTiendaCreateSchema
  );

  return { crear: ejecutar, loading, errores, errorApi };
}
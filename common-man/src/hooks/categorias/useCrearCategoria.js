import { categoriasLibroService } from "../../services/categoriaLibro.service";
import { categoriaLibroCreateSchema } from "../../validations/categorias/categoriaLibro.schema";
import { categoriaProductoService } from "../../services/categoriaProducto.service";
import { categoriaProductoCreateSchema } from "../../validations/categorias/categoriaProducto.schema";
import { useResourceMutation } from "../factories/useResourceMutation";

export function useCrearCategoriaLibro() {
  const { ejecutar, loading, errores, errorApi } = useResourceMutation(
    (data) => categoriasLibroService.crear(data),
    categoriaLibroCreateSchema
  );

  return { crear: ejecutar, loading, errores, errorApi };
}

export function useCrearCategoriaProducto() {
  const { ejecutar, loading, errores, errorApi } = useResourceMutation(
    (data) => categoriaProductoService.crear(data),
    categoriaProductoCreateSchema
  );

  return { crear: ejecutar, loading, errores, errorApi };
}
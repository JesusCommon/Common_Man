import { categoriasLibroService } from "../../services/categoriaLibro.service";
import { categoriaLibroUpdateSchema } from "../../validations/categorias/categoriaLibro.schema";
import { categoriaProductoService } from "../../services/categoriaProducto.service"
import { categoriaProductoUpdateSchema} from "../../validations/categorias/categoriaProducto.schema"
import { useResourceMutation } from "../factories/useResourceMutation";

export function useActualizarCategoriaLibro() {
  const { ejecutar, loading, errores, errorApi } = useResourceMutation(
    (data) => categoriasLibroService.actualizar(data.__id, data),
    categoriaLibroUpdateSchema
  );

  const actualizar = (id, formData) => ejecutar({ ...formData, __id: id });

  return { actualizar, loading, errores, errorApi };
}

export function useActualizarCategoriaProducto() {
  const { ejecutar, loading, errores, errorApi } = useResourceMutation(
    (data) => categoriaProductoService.actualizar(data.__id, data),
    categoriaProductoUpdateSchema
  );

  const actualizar = (id, formData) => ejecutar({ ...formData, __id: id });

  return { actualizar, loading, errores, errorApi };
}
import { categoriasLibroService } from "../../services/categoriaLibro.service";
import { categoriaLibroUpdateSchema } from "../../validations/categorias/categoriaLibro.schema";
import { categoriasTiendaService } from "../../services/categoriasTienda.service"
import { categoriaTiendaUpdateSchema} from "../../validations/categorias/categoriaTienda.schema"
import { useResourceMutation } from "../factories/useResourceMutation";

export function useActualizarCategoriaLibro() {
  const { ejecutar, loading, errores, errorApi } = useResourceMutation(
    (data) => categoriasLibroService.actualizar(data.__id, data),
    categoriaLibroUpdateSchema
  );

  const actualizar = (id, formData) => ejecutar({ ...formData, __id: id });

  return { actualizar, loading, errores, errorApi };
}

export function useActualizarCategoriaTienda() {
  const { ejecutar, loading, errores, errorApi } = useResourceMutation(
    (data) => categoriasTiendaService.actualizar(data.__id, data),
    categoriaTiendaUpdateSchema
  );

  const actualizar = (id, formData) => ejecutar({ ...formData, __id: id });

  return { actualizar, loading, errores, errorApi };
}
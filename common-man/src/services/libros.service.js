import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";
import { apiRequest } from "../api/apiRequest";
import { createBaseService } from "./createBaseService";

const { LIBROS } = ENDPOINTS;

export const librosService = {
  ...createBaseService(LIBROS),

  buscar: ({nombre, categoria_id, precio_min, precio_max, idioma, anio_publicacion, autor, 
    editorial, ordenar_por = "fecha_creacion", orden_desc = true, skip = 0, limit = 20} = {}) =>
    apiRequest(
      axiosClient.get(LIBROS.SEARCH, {
        params: {nombre, categoria_id, precio_min, precio_max, idioma, anio_publicacion, autor,
        editorial, ordenar_por, orden_desc, skip, limit
        },
      })
    ),

  obtenerPorIdentificador: (identificador) =>
    apiRequest(
      axiosClient.get(LIBROS.BY_IDENTIFIER(identificador))
    ),
};
import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";
import { apiRequest } from "../api/apiRequest";
import { createBaseService } from "./createBaseService";

const { PRODUCTOS } = ENDPOINTS;

export const productoService = {
  ...createBaseService(PRODUCTOS),

  buscar: ({nombre, categoria_id, precio_min, precio_max, disponible, ordenar_por = "fecha_creacion",
    orden_desc = true, skip = 0, limit = 20} = {}) =>
    apiRequest(
      axiosClient.get(PRODUCTOS.SEARCH, {
        params: {nombre, categoria_id, precio_min, precio_max, disponible, ordenar_por, 
        orden_desc, skip,limit,
        },
      })
    ),

  obtenerPorIdentificador: (identificador) =>
    apiRequest(
      axiosClient.get(PRODUCTOS.BY_IDENTIFIER(identificador))
    ),
};
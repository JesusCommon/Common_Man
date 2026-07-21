import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";
import { apiRequest } from "../api/apiRequest";
import { createBaseService } from "./createBaseService";

const { PRODUCTOS_TIENDA } = ENDPOINTS;

export const productosService = {
  ...createBaseService(PRODUCTOS_TIENDA),

  buscar: ({nombre, categoria_id, precio_min, precio_max, disponible, ordenar_por = "fecha_creacion",
    orden_desc = true, skip = 0, limit = 20} = {}) =>
    apiRequest(
      axiosClient.get(PRODUCTOS_TIENDA.SEARCH, {
        params: {nombre, categoria_id, precio_min, precio_max, disponible, ordenar_por, 
        orden_desc, skip,limit,
        },
      })
    ),

  obtenerPorIdentificador: (identificador) =>
    apiRequest(
      axiosClient.get(PRODUCTOS_TIENDA.BY_IDENTIFIER(identificador))
    ),
};
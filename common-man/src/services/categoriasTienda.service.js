import { ENDPOINTS } from "../api/endpoints";
import { createBaseService } from "./createBaseService";

export const categoriasTiendaService = createBaseService(ENDPOINTS.CATEGORIAS_TIENDA);
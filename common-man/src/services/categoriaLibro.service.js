import { ENDPOINTS } from "../api/endpoints";
import { createBaseService } from "./createBaseService";

export const categoriasLibroService = createBaseService(ENDPOINTS.CATEGORIAS_LIBRO);
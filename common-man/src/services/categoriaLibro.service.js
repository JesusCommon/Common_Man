import { ENDPOINTS } from "../api/endpoints";
import { createBaseService } from "./createBaseService";

export const categoriaLibroService = createBaseService(ENDPOINTS.CATEGORIA_LIBRO);
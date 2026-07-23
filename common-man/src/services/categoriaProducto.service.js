import { ENDPOINTS } from "../api/endpoints";
import { createBaseService } from "./createBaseService";

export const categoriaProductoService = createBaseService(ENDPOINTS.CATEGORIA_PRODUCTOS);
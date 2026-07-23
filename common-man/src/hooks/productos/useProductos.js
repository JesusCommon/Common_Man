import { useCallback } from "react";
import { useResourceList } from "../factories/useResourceList";
import { productoService } from "../../services/productos.service";

export function useProductos() {
    const fetchFn = useCallback(() => productoService.listar(), []);
    const {data, loading, error, recargar } = useResourceList(fetchFn);

    return {productos: data, loading, error, recargar};
}
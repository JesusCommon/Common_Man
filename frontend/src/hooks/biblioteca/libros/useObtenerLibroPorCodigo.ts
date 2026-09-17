import { useQuery } from "@tanstack/react-query";
import {
  obtenerLibroPorIsbnService,
  obtenerLibroPorSkuService,
} from "@/services";

export type TipoCodigoLibro = "isbn" | "sku";

const SERVICIOS: Record<TipoCodigoLibro, typeof obtenerLibroPorIsbnService> = {
  isbn: obtenerLibroPorIsbnService,
  sku: obtenerLibroPorSkuService,
};

export function useObtenerLibroPorCodigo(tipo: TipoCodigoLibro, codigo: string) {
  return useQuery({
    queryKey: ["libros", "admin", tipo, codigo],
    queryFn: async () => {
      const result = await SERVICIOS[tipo](codigo);
      if (!result.success) throw result.error;
      return result.data;
    },
    enabled: !!codigo.trim(),
    retry: false,
  });
}
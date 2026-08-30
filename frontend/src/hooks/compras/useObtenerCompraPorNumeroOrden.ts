import { useQuery } from "@tanstack/react-query";
import { obtenerCompraPorNumeroOrdenService } from "@/services";

export function useObtenerCompraPorNumeroOrden(numeroOrden: string) {
  return useQuery({
    queryKey: ["compras", "orden", numeroOrden],
    queryFn: async () => {
      const result = await obtenerCompraPorNumeroOrdenService(numeroOrden);
      if (!result.success) throw result.error;
      return result.data;
    },
    enabled: !!numeroOrden,
  });
}
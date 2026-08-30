import { useQuery } from "@tanstack/react-query";
import { obtenerCompraPorIdService } from "@/services";

export function useObtenerCompraPorId(id: string) {
  return useQuery({
    queryKey: ["compras", id],
    queryFn: async () => {
      const result = await obtenerCompraPorIdService(id);
      if (!result.success) throw result.error;
      return result.data;
    },
    enabled: !!id,
  });
}
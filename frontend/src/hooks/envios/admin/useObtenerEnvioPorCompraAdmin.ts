import { useQuery } from "@tanstack/react-query";
import { obtenerEnvioPorCompraAdminService } from "@/services";

export function useObtenerEnvioPorCompraAdmin(compraId: string) {
  return useQuery({
    queryKey: ["envios", "admin", "compra", compraId],
    queryFn: async () => {
      const result = await obtenerEnvioPorCompraAdminService(compraId);
      if (!result.success) throw result.error;
      return result.data;
    },
    enabled: !!compraId,
  });
}
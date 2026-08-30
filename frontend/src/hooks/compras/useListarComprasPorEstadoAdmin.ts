import { useQuery } from "@tanstack/react-query";
import { listarComprasPorEstadoAdminService } from "@/services";

export function useListarComprasPorEstadoAdmin(params: { estado: string; skip?: number; limit?: number }) {
  return useQuery({
    queryKey: ["compras", "admin", "estado", params],
    queryFn: async () => {
      const result = await listarComprasPorEstadoAdminService(params);
      if (!result.success) throw result.error;
      return result.data;
    },
    enabled: !!params.estado,
  });
}
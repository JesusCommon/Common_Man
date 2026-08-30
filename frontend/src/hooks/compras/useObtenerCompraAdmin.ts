import { useQuery } from "@tanstack/react-query";
import { obtenerCompraAdminService } from "@/services";

export function useObtenerCompraAdmin(id: string) {
  return useQuery({
    queryKey: ["compras", "admin", id],
    queryFn: async () => {
      const result = await obtenerCompraAdminService(id);
      if (!result.success) throw result.error;
      return result.data;
    },
    enabled: !!id,
  });
}
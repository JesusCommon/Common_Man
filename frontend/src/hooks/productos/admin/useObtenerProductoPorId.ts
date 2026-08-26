import { useQuery } from "@tanstack/react-query";
import { obtenerProductoPorIdAdminService } from "@/services";

export function useObtenerProductoPorIdAdmin(id: string | undefined) {
  return useQuery({
    queryKey: ["productos", "admin", id],
    queryFn: async () => {
      if (!id) throw new Error("ID de producto requerido");
      const result = await obtenerProductoPorIdAdminService(id);
      if (!result.success) throw result.error;
      return result.data;
    },
    enabled: !!id,
  });
}
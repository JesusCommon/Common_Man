import { useQuery } from "@tanstack/react-query";
import { buscarAdmin } from "@/services";

export function useBuscarAdmin(params?: {
  nombre?: string;
  apellido?: string;
  username?: string;
  skip?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["usuarios", "admin", "buscar", params],
    queryFn: async () => {
      const result = await buscarAdmin(params);
      if (!result.success) throw result.error;
      return result.data;
    },
    enabled: !!params && Object.keys(params).length > 0,
  });
}
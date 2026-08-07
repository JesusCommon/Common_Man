import { useQuery } from "@tanstack/react-query";
import { listarUsuariosInactivos } from "@/services";

export function useListarInactivos(params?: { skip?: number; limit?: number }) {
  return useQuery({
    queryKey: ["usuarios", "admin", "inactivos", params],
    queryFn: async () => {
      const result = await listarUsuariosInactivos(params);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}
import { useQuery } from "@tanstack/react-query";
import { listarUsuariosInactivos } from "@/services";

type ListarParams = {
  skip?: number;
  limit?: number;
};

export function useListarInactivos({ skip = 0, limit = 20 }: ListarParams = {}) {
  return useQuery({
    queryKey: ["usuarios", "admin", "inactivos", skip, limit],
    queryFn: async () => {
      const result = await listarUsuariosInactivos(skip, limit);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}
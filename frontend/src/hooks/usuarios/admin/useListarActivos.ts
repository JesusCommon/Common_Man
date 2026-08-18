import { useQuery } from "@tanstack/react-query";
import { listarUsuariosActivos } from "@/services";

type ListarParams = {
  skip?: number;
  limit?: number;
};

export function useListarActivos({ skip = 0, limit = 20 }: ListarParams = {}) {
  return useQuery({
    queryKey: ["usuarios", "admin", "activos", skip, limit],
    queryFn: async () => {
      const result = await listarUsuariosActivos(skip, limit);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}
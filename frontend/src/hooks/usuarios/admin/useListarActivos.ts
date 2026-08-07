import { useQuery } from "@tanstack/react-query";
import { listarUsuariosActivos } from "@/services";

export function useListarActivos() {
  return useQuery({
    queryKey: ["usuarios", "admin", "activos"],
    queryFn: async () => {
      const result = await listarUsuariosActivos();
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}
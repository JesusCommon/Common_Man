import { useQuery } from "@tanstack/react-query";
import { listarDireccionesDeUsuarioAdminService } from "@/services";

export function useListarDireccionesDeUsuarioAdmin(
  usuarioId: string,
  params: { skip?: number; limit?: number } = {}
) {
  return useQuery({
    queryKey: ["direcciones", "admin", usuarioId, params],
    queryFn: async () => {
      const result = await listarDireccionesDeUsuarioAdminService(
        usuarioId,
        params
      );
      if (!result.success) throw result.error;
      return result.data;
    },
    enabled: !!usuarioId,
  });
}
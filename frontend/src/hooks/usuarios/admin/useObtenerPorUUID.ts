import { useQuery } from "@tanstack/react-query";
import { obtenerPorUUID } from "@/services";

export function useObtenerPorUUID(identificador: string | undefined) {
  return useQuery({
    queryKey: ["usuarios", "admin", "uuid", identificador],
    queryFn: async () => {
      const result = await obtenerPorUUID(identificador!);
      if (!result.success) throw result.error;
      return result.data;
    },
    enabled: !!identificador,
  });
}
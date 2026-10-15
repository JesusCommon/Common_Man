import { useQuery } from "@tanstack/react-query";
import { obtenerContadoresMensajesService } from "@/services";

export function useContadoresMensajes() {
  return useQuery({
    queryKey: ["mensajes", "contadores"],
    queryFn: async () => {
      const result = await obtenerContadoresMensajesService();
      if (!result.success) throw result.error;
      return result.data;
    },
    staleTime: 1000 * 30,
  });
}
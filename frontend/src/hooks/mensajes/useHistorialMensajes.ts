import { useQuery } from "@tanstack/react-query";
import { obtenerHistorialMensajesService } from "@/services";

export function useHistorialMensajes(
  conversacionId: string | null,
  skip = 0,
  limit = 50
) {
  return useQuery({
    queryKey: ["mensajes", "historial", conversacionId, { skip, limit }],
    queryFn: async () => {
      if (!conversacionId) throw new Error("ID de conversación requerido");
      const result = await obtenerHistorialMensajesService(
        conversacionId,
        skip,
        limit
      );
      if (!result.success) throw result.error;
      return result.data;
    },
    enabled: !!conversacionId,
  });
}
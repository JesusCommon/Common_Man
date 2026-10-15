import { useQuery } from "@tanstack/react-query";
import { obtenerDetalleConversacionService } from "@/services";

export function useDetalleConversacion(conversacionId: string | null) {
  return useQuery({
    queryKey: ["mensajes", "detalle", conversacionId],
    queryFn: async () => {
      if (!conversacionId) throw new Error("ID de conversación requerido");
      const result = await obtenerDetalleConversacionService(conversacionId);
      if (!result.success) throw result.error;
      return result.data;
    },
    enabled: !!conversacionId,
  });
}
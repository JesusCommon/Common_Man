import { useQuery } from "@tanstack/react-query";
import { obtenerMovimientoDeCompraService } from "@/services";

export function useObtenerMovimientoDeCompra(compraId: string) {
  return useQuery({
    queryKey: ["pagos", "movimiento", compraId],
    queryFn: async () => {
      const result = await obtenerMovimientoDeCompraService({ compraId });
      if (!result.success) throw result.error;
      return result.data;
    },
    enabled: !!compraId,
  });
}
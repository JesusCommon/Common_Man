import { useQuery } from "@tanstack/react-query";
import { obtenerMiReporteService } from "@/services";

interface UseObtenerMiReporteOptions {
  /**
   * Habilita actualización automática cada X milisegundos
   * Útil para chat en tiempo real
   * @default 5000 (5 segundos)
   */
  refetchInterval?: number;
}

export function useObtenerMiReporte(
  reporteId: string,
  options: UseObtenerMiReporteOptions = {}
) {
  const { refetchInterval = 5000 } = options;

  return useQuery({
    queryKey: ["reportes", reporteId],
    queryFn: async () => {
      const result = await obtenerMiReporteService(reporteId);
      if (!result.success) throw result.error;
      return result.data;
    },
    enabled: !!reporteId,
    // ✅ Actualización automática mientras el usuario ve el chat
    refetchInterval: reporteId ? refetchInterval : false,
    // Mantener datos anteriores mientras se recarga (evita parpadeo)
    placeholderData: (previousData) => previousData,
  });
}
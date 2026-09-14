import { useQuery } from "@tanstack/react-query";
import { obtenerReporteAdminService } from "@/services";

interface UseObtenerReporteAdminOptions {
  /**
   * Habilita actualización automática cada X milisegundos
   * @default 5000 (5 segundos)
   */
  refetchInterval?: number;
}

export function useObtenerReporteAdmin(
  reporteId: string,
  options: UseObtenerReporteAdminOptions = {}
) {
  const { refetchInterval = 5000 } = options;

  return useQuery({
    queryKey: ["reportes", "admin", reporteId],
    queryFn: async () => {
      const result = await obtenerReporteAdminService(reporteId);
      if (!result.success) throw result.error;
      return result.data;
    },
    enabled: !!reporteId,
    // ✅ Actualización automática mientras el admin ve el chat
    refetchInterval: reporteId ? refetchInterval : false,
    // Mantener datos anteriores mientras se recarga (evita parpadeo)
    placeholderData: (previousData) => previousData,
  });
}
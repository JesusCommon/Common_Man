import { useQuery } from "@tanstack/react-query";
import {
  listarGenerosService,
  listarGenerosActivosService,
  listarGenerosInactivosService,
} from "@/services";

export type FiltroListadoGeneros = "all" | "activos" | "inactivos";

const SERVICIOS: Record<FiltroListadoGeneros, typeof listarGenerosService> = {
  all: listarGenerosService,
  activos: listarGenerosActivosService,
  inactivos: listarGenerosInactivosService,
};

export function useListarGeneros(
  filtro: FiltroListadoGeneros = "all",
  params: { skip?: number; limit?: number } = {}
) {
  return useQuery({
    queryKey: ["generos", filtro, params],
    queryFn: async () => {
      const result = await SERVICIOS[filtro](params);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}
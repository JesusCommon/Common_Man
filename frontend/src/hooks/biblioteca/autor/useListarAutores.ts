import { useQuery } from "@tanstack/react-query";
import {
  listarAutoresService,
  listarAutoresActivosService,
  listarAutoresInactivosService,
} from "@/services";

export type FiltroListadoAutores = "all" | "activos" | "inactivos";

const SERVICIOS: Record<FiltroListadoAutores, typeof listarAutoresService> = {
  all: listarAutoresService,
  activos: listarAutoresActivosService,
  inactivos: listarAutoresInactivosService,
};

export function useListarAutores(
  filtro: FiltroListadoAutores = "all",
  params: { skip?: number; limit?: number } = {}
) {
  return useQuery({
    queryKey: ["autores", filtro, params],
    queryFn: async () => {
      const result = await SERVICIOS[filtro](params);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}
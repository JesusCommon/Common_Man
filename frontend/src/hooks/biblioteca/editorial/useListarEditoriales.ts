import { useQuery } from "@tanstack/react-query";
import {
  listarEditorialesService,
  listarEditorialesActivasService,
  listarEditorialesInactivasService,
} from "@/services";

export type FiltroListadoEditoriales = "all" | "activos" | "inactivos";

const SERVICIOS: Record<FiltroListadoEditoriales, typeof listarEditorialesService> = {
  all: listarEditorialesService,
  activos: listarEditorialesActivasService,
  inactivos: listarEditorialesInactivasService,
};

export function useListarEditoriales(
  filtro: FiltroListadoEditoriales = "all",
  params: { skip?: number; limit?: number } = {}
) {
  return useQuery({
    queryKey: ["editoriales", filtro, params],
    queryFn: async () => {
      const result = await SERVICIOS[filtro](params);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}
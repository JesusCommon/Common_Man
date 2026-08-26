import { useQuery } from "@tanstack/react-query";
import { obtenerProductoPorSlugService } from "@/services";

export function useObtenerProductoPorSlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["productos", "slug", slug],
    queryFn: async () => {
      if (!slug) throw new Error("Slug requerido");
      const result = await obtenerProductoPorSlugService(slug);
      if (!result.success) throw result.error;
      return result.data;
    },
    enabled: !!slug,
  });
}
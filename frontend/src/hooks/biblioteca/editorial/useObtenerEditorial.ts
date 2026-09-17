import { useQuery } from "@tanstack/react-query";
import { obtenerEditorialService } from "@/services";

export function useObtenerEditorial(id: string) {
  return useQuery({
    queryKey: ["editoriales", id],
    queryFn: async () => {
      const result = await obtenerEditorialService(id);
      if (!result.success) throw result.error;
      return result.data;
    },
    enabled: !!id,
  });
}
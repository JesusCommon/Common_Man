import { useQuery } from "@tanstack/react-query";
import { listarEditorialesPublicasService } from "@/services";

export function useEditorialesPublicas() {
  return useQuery({
    queryKey: ["editoriales", "publicas"],
    queryFn: async () => {
      const result = await listarEditorialesPublicasService();
      if (!result.success) throw result.error;
      return result.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
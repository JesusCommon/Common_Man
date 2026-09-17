import { useMutation, useQueryClient } from "@tanstack/react-query";
import { desactivarEditorialService } from "@/services";

export function useDesactivarEditorial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await desactivarEditorialService(id);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["editoriales"] });
    },
  });
}
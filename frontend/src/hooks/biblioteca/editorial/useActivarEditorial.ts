import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activarEditorialService } from "@/services";

export function useActivarEditorial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await activarEditorialService(id);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["editoriales"] });
    },
  });
}
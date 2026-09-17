import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearEditorialService } from "@/services";

export function useCrearEditorial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: unknown) => {
      const result = await crearEditorialService(params);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["editoriales"] });
    },
  });
}
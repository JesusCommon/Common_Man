import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eliminarPortadaService } from "@/services";

export function useEliminarPortada() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eliminarPortadaService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuario"] });
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
  });
}
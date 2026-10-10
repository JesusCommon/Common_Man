import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actualizarPortadaService } from "@/services";

export function useActualizarPortada() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: actualizarPortadaService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuario", "me"] });
      queryClient.invalidateQueries({ queryKey: ["usuario", "perfil"] });
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
  });
}
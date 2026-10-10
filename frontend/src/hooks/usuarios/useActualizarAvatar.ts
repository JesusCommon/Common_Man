import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actualizarAvatarService } from "@/services";

export function useActualizarAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: actualizarAvatarService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuario", "me"] });
      queryClient.invalidateQueries({ queryKey: ["usuario", "perfil"] });
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
  });
}
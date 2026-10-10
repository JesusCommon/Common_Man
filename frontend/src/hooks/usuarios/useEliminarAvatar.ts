import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eliminarAvatarService } from "@/services";

export function useEliminarAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eliminarAvatarService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuario", "me"] });
      queryClient.invalidateQueries({ queryKey: ["usuario", "perfil"] });
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
  });
}
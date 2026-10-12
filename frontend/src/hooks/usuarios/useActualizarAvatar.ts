import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actualizarAvatarService } from "@/services";

export function useActualizarAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: actualizarAvatarService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuario"] });
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
  });
}
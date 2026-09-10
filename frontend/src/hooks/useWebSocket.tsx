import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store";
import { wsManager } from "@/lib/websocket";
import { useQueryClient } from "@tanstack/react-query";

export function useWebSocket() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();
  const previousTokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      wsManager.disconnect();
      previousTokenRef.current = null;
      return;
    }

    if (previousTokenRef.current === accessToken) return;

    previousTokenRef.current = accessToken;
    wsManager.disconnect();

    wsManager.connect(accessToken, {
      onNotification: () => {
        queryClient.invalidateQueries({ queryKey: ["notificaciones"] });
      },
      onSaldoActualizado: (data: { saldo: number }) => {
        useAuthStore.getState().updateUser({ saldo: data.saldo });
      },
    });

    return () => {
      wsManager.disconnect();
      previousTokenRef.current = null;
    };
  }, [accessToken, queryClient]);
}
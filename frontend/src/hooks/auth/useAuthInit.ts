import { useEffect } from "react";
import { useAuthStore } from "@/store";
import { miPerfil } from "@/services";

export function useAuthInit() {
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (!hasHydrated) return;

    if (accessToken && !user) {
      miPerfil().then((result) => {
        if (result.success) {
          setUser(result.data);
        } else {
          logout();
        }
      });
    }
  }, [hasHydrated, accessToken, user, setUser, logout]);
}
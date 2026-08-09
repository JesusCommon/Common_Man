import { useEffect } from "react";
import { useAuthStore } from "@/store";
import { usePerfil } from "../usuarios/usePerfil";

export function useAuthInit() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const setUser = useAuthStore((s) => s.setUser);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const { data, isSuccess, isError } = usePerfil();

  useEffect(() => {
    if (isSuccess && data && accessToken && refreshToken) {
      setUser(data);
    }

    if (isError) {
      useAuthStore.getState().logout();
    }
  }, [isSuccess, isError, data, accessToken, refreshToken, setUser]);
}
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UsuarioPropioResponse } from "@/api/types";

interface AuthState {
  user: UsuarioPropioResponse | null;
  accessToken: string | null;
  refreshToken: string | null;
  hasHydrated: boolean;
  setTokens: (payload: { accessToken: string; refreshToken: string }) => void;
  setUser: (user: UsuarioPropioResponse) => void;
  updateUser: (user: Partial<UsuarioPropioResponse>) => void;
  logout: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      hasHydrated: false,

      setTokens: ({ accessToken, refreshToken }) =>
        set({ accessToken, refreshToken }),

      setUser: (user) => set({ user }),

      updateUser: (partialUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partialUser } : null,
        })),

      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null, hasHydrated: true }),

      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: "common-man-auth",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          // Silencioso en producción
        }
        useAuthStore.getState().setHasHydrated(true);
      },
    }
  )
);
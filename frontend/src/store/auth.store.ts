import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UsuarioPropioResponse } from "@/api/types";

interface AuthState {
  user: UsuarioPropioResponse | null;
  accessToken: string | null;
  refreshToken: string | null;

  isAuthenticated: boolean;
  isAdmin: boolean;

  setTokens: (payload: { accessToken: string; refreshToken: string }) => void;
  setUser: (user: UsuarioPropioResponse) => void;
  updateUser: (user: Partial<UsuarioPropioResponse>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      get isAuthenticated() {
        return !!get().accessToken;
      },

      get isAdmin() {
        return get().user?.rol === "admin";
      },

      setTokens: ({ accessToken, refreshToken }) =>
        set({ accessToken, refreshToken }),

      setUser: (user) => set({ user }),

      updateUser: (partialUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partialUser } : null,
        })),

      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null }),
    }),
    {
      name: "common-man-auth",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
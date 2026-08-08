import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UsuarioPropioResponse } from "@/api/types";

interface AuthState {
  user: UsuarioPropioResponse | null;
  accessToken: string | null;
  refreshToken: string | null;

  isAuthenticated: boolean;
  isAdmin: boolean;

  setAuth: (payload: {
    user: UsuarioPropioResponse;
    accessToken: string;
    refreshToken: string;
  }) => void;

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
        return !!get().accessToken && !!get().user;
      },

      get isAdmin() {
        return get().user?.rol === "admin";
      },

      setAuth: ({ user, accessToken, refreshToken }) =>
        set({ user, accessToken, refreshToken }),

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
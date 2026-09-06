import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";
import { API_CONFIG } from "@/api/config";
import type { UsuarioPropioResponse } from "@/api/types";

interface AuthState {
  user: UsuarioPropioResponse | null;
  accessToken: string | null;
  refreshToken: string | null;
  hasHydrated: boolean;
  isRefreshing: boolean;
  setTokens: (payload: { accessToken: string; refreshToken: string }) => void;
  setUser: (user: UsuarioPropioResponse) => void;
  updateUser: (user: Partial<UsuarioPropioResponse>) => void;
  refreshAccessToken: () => Promise<boolean>;
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
      isRefreshing: false,

      setTokens: ({ accessToken, refreshToken }) =>
        set({ accessToken, refreshToken }),

      setUser: (user) => set({ user }),

      updateUser: (partialUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partialUser } : null,
        })),

      refreshAccessToken: async () => {
        const currentRefresh = get().refreshToken;
        if (!currentRefresh) return false;
        if (get().isRefreshing) return false;

        set({ isRefreshing: true });

        try {
          const response = await axios.post<{
            access_token: string;
            refresh_token: string;
          }>(
            `${API_CONFIG.BASE_URL}/auth/refresh`,
            { refresh_token: currentRefresh },
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: API_CONFIG.WITH_CREDENTIALS,
              timeout: API_CONFIG.TIMEOUT,
            }
          );

          set({
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
            isRefreshing: false,
          });

          return true;
        } catch {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isRefreshing: false,
          });
          return false;
        }
      },

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          hasHydrated: true,
        }),

      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: "common-man-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),

      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
          console.log("✅ Auth rehidratado:", {
            hasUser: !!state.user,
            hasAccess: !!state.accessToken,
          });
        }
      },
    }
  )
);
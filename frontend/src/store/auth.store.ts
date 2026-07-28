import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TokenResponse, Usuario } from '../types';

interface AuthState {
  usuario: Usuario | null;
  accessToken: string | null;
  refreshToken: string | null;
}

interface AuthActions {
  setTokens: (tokens: TokenResponse) => void;
  setUsuario: (usuario: Usuario) => void;
  clearSession: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  usuario: null,
  accessToken: null,
  refreshToken: null,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,

      setTokens: (tokens) =>
        set({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
        }),

      setUsuario: (usuario) => set({ usuario }),

      clearSession: () => set(initialState),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        usuario: state.usuario,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);

export function useIsAuthenticated(): boolean {
  return useAuthStore((state) => state.accessToken !== null);
}
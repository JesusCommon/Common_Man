import { useCallback } from 'react';
import { useAsync } from './common/useAsync';
import * as authService from '../service/auth.service';
import { useAuthStore } from '../store/auth.store';
import type { LoginRequest, RefreshRequest, TokenResponse } from '../types';

export function useLogin() {
  const { execute, ...rest } = useAsync<TokenResponse, [LoginRequest]>(
    authService.login,
  );
  const setTokens = useAuthStore((state) => state.setTokens);

  const login = useCallback(
    async (credenciales: LoginRequest): Promise<TokenResponse> => {
      const tokens = await execute(credenciales);
      setTokens(tokens);
      return tokens;
    },
    [execute, setTokens],
  );

  return { ...rest, execute: login };
}

export function useRefrescarToken() {
  const { execute, ...rest } = useAsync<TokenResponse, [RefreshRequest]>(
    authService.refrescarToken,
  );
  const setTokens = useAuthStore((state) => state.setTokens);

  const refrescar = useCallback(
    async (payload: RefreshRequest): Promise<TokenResponse> => {
      const tokens = await execute(payload);
      setTokens(tokens);
      return tokens;
    },
    [execute, setTokens],
  );

  return { ...rest, execute: refrescar };
}

export function useLogout() {
  const { execute, ...rest } = useAsync<unknown, []>(authService.logout);
  const clearSession = useAuthStore((state) => state.clearSession);

  const logout = useCallback(async (): Promise<unknown> => {
    try {
      return await execute();
    } finally {
      clearSession();
    }
  }, [execute, clearSession]);

  return { ...rest, execute: logout };
}
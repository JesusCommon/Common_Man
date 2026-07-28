import { fetchClient } from '../api/client/fetchClient';
import { authEndpoints } from '../api/endpoints';
import type { LoginRequest, RefreshRequest, TokenResponse } from '../types';

async function ejecutar<T>(operacion: string, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error(`[auth.service] Error en "${operacion}":`, error);
    throw error;
  }
}

export async function login(credenciales: LoginRequest): Promise<TokenResponse> {
  return ejecutar('login', async () => {
    const response = await fetchClient.post<TokenResponse>(
      authEndpoints.login(),
      credenciales,
    );
    return response.data;
  });
}

export async function refrescarToken(
  payload: RefreshRequest,
): Promise<TokenResponse> {
  return ejecutar('refrescarToken', async () => {
    const response = await fetchClient.post<TokenResponse>(
      authEndpoints.refrescar(),
      payload,
    );
    return response.data;
  });
}

export async function logout(): Promise<unknown> {
  return ejecutar('logout', async () => {
    const response = await fetchClient.post<unknown>(authEndpoints.logout());
    return response.data;
  });
}
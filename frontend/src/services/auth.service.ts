import { LoginSchema, RefreshSchema } from "@/schemas";
import { login, refresh } from "@/api/endpoints/auth";
import type { TokenResponse } from "@/api/types";
import { useAuthStore } from "@/store";
import type { ServiceResult } from "./types";
import { validationError, networkError } from "./types";
import type { AxiosError } from "axios";

export async function iniciarSesion(credentials: unknown): Promise<ServiceResult<TokenResponse>> {
  const parsed = LoginSchema.safeParse(credentials);
  if (!parsed.success) {
    return { success: false, error: validationError(parsed.error) };
  }

  try {
    const data = await login(parsed.data);
    useAuthStore.getState().setTokens({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    });
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function refrescarToken(payload: unknown): Promise<ServiceResult<TokenResponse>> {
  const parsed = RefreshSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, error: validationError(parsed.error) };
  }

  try {
    const data = await refresh(parsed.data);
    useAuthStore.getState().setTokens({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    });
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}
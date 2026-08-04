import { apiClient } from "../client";
import type {
  LoginRequest,
  RefreshRequest,
  TokenResponse,
} from "../types";

export async function login(credentials: LoginRequest) {
  const { data } = await apiClient.post<TokenResponse>(
    "/auth/login",
    credentials
  );
  return data;
}

export async function refresh(payload: RefreshRequest) {
  const { data } = await apiClient.post<TokenResponse>(
    "/auth/refresh",
    payload
  );
  return data;
}
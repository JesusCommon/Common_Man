import { apiClient } from "../client";
import type { RespuestaConMensaje, Paginado } from "../types/core";
import type { FollowCreateInput, FollowPublicResponse } from "@/schemas";

export async function seguir(data: FollowCreateInput) {
  const { data: response } = await apiClient.post<RespuestaConMensaje<FollowPublicResponse>>(
    "/follows/",
    data
  );
  return response;
}

export async function dejarDeSeguir(username: string) {
  const { data: response } = await apiClient.delete<RespuestaConMensaje<FollowPublicResponse>>(
    `/follows/${username}`
  );
  return response;
}

export async function listarMisSeguidores(skip = 0, limit = 20) {
  const { data } = await apiClient.get<Paginado<FollowPublicResponse>>("/follows/me/seguidores", { 
    params: { skip, limit } 
  });
  return data;
}

export async function listarMisSeguidos(skip = 0, limit = 20) {
  const { data } = await apiClient.get<Paginado<FollowPublicResponse>>("/follows/me/seguidos", { 
    params: { skip, limit } 
  });
  return data;
}

export async function sigueA(username: string) {
  const { data: response } = await apiClient.get<RespuestaConMensaje<boolean>>(
    `/follows/me/sigue-a/${username}`
  );
  return response;
}

export async function listarSeguidoresDe(username: string, skip = 0, limit = 20) {
  const { data } = await apiClient.get<Paginado<FollowPublicResponse>>(
    `/follows/perfil/${username}/seguidores`,
    { params: { skip, limit } }
  );
  return data;
}

export async function listarSeguidosDe(username: string, skip = 0, limit = 20) {
  const { data } = await apiClient.get<Paginado<FollowPublicResponse>>(
    `/follows/perfil/${username}/seguidos`,
    { params: { skip, limit } }
  );
  return data;
}
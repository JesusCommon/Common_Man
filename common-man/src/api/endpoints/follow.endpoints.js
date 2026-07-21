export const FOLLOW_ENDPOINTS = {
    FOLLOW: (id) => `/seguimientos/${id}/seguir`,
    UNFOLLOW: (id) => `/seguimientos/${id}/dejar-de-seguir`,
    SEGUIDORES: (id) => `/seguimientos/${id}/seguidores`,
    SEGUIDOS: (id) => `/productos/${id}/seguidos`
};
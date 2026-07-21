import { USUARIOS_ENDPOINTS } from "./usuarios.endpoints";
import { AUTH_ENDPOINTS } from "./auth.endpoints";
import { CATEGORIAS_LIBROS_ENDPOINTS } from "./categorias_libros.endpoints";
import { LIBROS_ENDPOINTS } from "./libros.endpoints";
import { CATEGORIAS_TIENDA_ENDPOINTS } from "./categorias_tienda.endpoints";
import { PRODUCTOS_TIENDA_ENDPOINTS } from "./productos_tienda.endpoints";
import { FOLLOW_ENDPOINTS } from "./follow.endpoints";

export const ENDPOINTS = {
  USUARIOS: USUARIOS_ENDPOINTS,
  AUTH: AUTH_ENDPOINTS,
  CATEGORIAS_LIBRO: CATEGORIAS_LIBROS_ENDPOINTS,
  LIBROS: LIBROS_ENDPOINTS,
  CATEGORIAS_TIENDA: CATEGORIAS_TIENDA_ENDPOINTS,
  TIENDA: PRODUCTOS_TIENDA_ENDPOINTS,
  FOLLOW: FOLLOW_ENDPOINTS,
};
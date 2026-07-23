import { USUARIOS_ENDPOINTS } from "./usuarios.endpoints";
import { AUTH_ENDPOINTS } from "./auth.endpoints";
import { CATEGORIA_LIBROS_ENDPOINTS } from "./categoria_libro.endpoints";
import { LIBROS_ENDPOINTS } from "./libros.endpoints";
import { CATEGORIA_PRODUCTOS_ENDPOINTS } from "./categoria_producto.endpoints";
import { PRODUCTOS_ENDPOINTS } from "./productos.endpoints";
import { FOLLOW_ENDPOINTS } from "./follow.endpoints";

export const ENDPOINTS = {
  USUARIOS: USUARIOS_ENDPOINTS,
  AUTH: AUTH_ENDPOINTS,
  CATEGORIA_LIBRO: CATEGORIA_LIBROS_ENDPOINTS,
  LIBROS: LIBROS_ENDPOINTS,
  CATEGORIA_PRODUCTOS: CATEGORIA_PRODUCTOS_ENDPOINTS,
  PRODUCTOS: PRODUCTOS_ENDPOINTS,
  FOLLOW: FOLLOW_ENDPOINTS,
};
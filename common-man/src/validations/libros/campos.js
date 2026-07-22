import { z } from "zod";

const NOMBRE_REGEX = /^[A-Za-z0-9À-ÿñÑ\s]+$/;
const NOMBRE_AUTOR_REGEX = /^[A-Za-zÀ-ÿñÑ\s]+$/;

function toTitleCase(str) {
  return str
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export const nombreSchema = z
  .string()
  .trim()
  .min(1, "El nombre del libro tiene que tener al menos 1 caracter")
  .max(150, "El nombre del libro no puede llevar más de 150 caracteres")
  .regex(NOMBRE_REGEX, "El nombre del libro solo puede llevar letras y/o números")
  .transform(toTitleCase);

export const autorSchema = z
  .string()
  .trim()
  .min(3, "El autor tiene que tener al menos 3 caracteres")
  .max(150, "El autor no debe tener más de 150 caracteres")
  .regex(NOMBRE_AUTOR_REGEX, "El autor solo debe llevar letras")
  .transform(toTitleCase);

  export const idiomaSchema = z.enum(["Español", "Inglés", "Portugués"], {
  errorMap: () => ({ message: "El idioma debe ser Español, Inglés o Portugués" }),
});

export const descripcionSchema = z
  .string()
  .trim()
  .max(1000, "La descripción no puede tener más de 1000 caracteres");

export const anioPublicacionSchema = z
  .number({ invalid_type_error: "El año de publicación debe ser un número entero" })
  .int("El año de publicación debe ser un número entero")
  .min(1000, "El año de publicación debe estar entre 1000 y el año actual")
  .max(new Date().getFullYear(), "El año de publicación no puede ser mayor al año actual");

export const editorialSchema = z
  .string()
  .trim()
  .min(2, "La editorial debe tener al menos 2 caracteres")
  .max(150, "La editorial no puede llevar más de 150 caracteres")
  .transform(toTitleCase);

export const portadaSchema = z
  .string()
  .url("La portada debe ser una URL válida");

export const contenidoSchema = z
  .string()
  .url("El contenido debe ser una URL válida");

export const precioSchema = z
  .number({ invalid_type_error: "El precio debe ser un número" })
  .nonnegative("El precio no puede ser negativo");

export const stockSchema = z
  .number({ invalid_type_error: "El stock debe ser un número entero" })
  .int("El stock debe ser un número entero")
  .nonnegative("El stock no puede ser negativo");

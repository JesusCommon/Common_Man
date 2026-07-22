import { z } from "zod";

const NOMBRE_REGEX = /^[A-Za-z0-9Á-ÿñÑ\s]+$/;
const CODIGO_REGEX = /^[A-Za-z0-9_-]+$/;

function toTitleCase(str) {
  return str
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export const nombreProductoSchema = z
  .string()
  .trim()
  .min(1, "El nombre del producto debe tener entre 1 a 150 caracteres")
  .max(150, "El nombre del producto debe tener entre 1 a 150 caracteres")
  .regex(NOMBRE_REGEX, "El nombre del producto solo debe contener letras y/o números")
  .transform(toTitleCase);

export const codigoSchema = z
  .string()
  .trim()
  .min(3, "El código debe tener entre 3 a 50 caracteres")
  .max(50, "El código debe tener entre 3 a 50 caracteres")
  .regex(CODIGO_REGEX, "El código solo puede llevar letras, números o guiones")
  .transform((v) => v.toUpperCase());

export const descripcionProductoSchema = z
  .string()
  .trim()
  .max(1000, "La descripción no puede tener más de 1000 caracteres");

export const fotografiaSchema = z
  .string()
  .url("La fotografía debe ser una URL válida")
  .refine(
    (v) => /\.(jpg|jpeg|png|webp)$/i.test(v),
    "La fotografía debe ser una URL con extensión .jpg, .jpeg, .png o .webp"
  );

export const precioProductoSchema = z
  .number({ invalid_type_error: "El precio debe ser un número" })
  .nonnegative("El precio no puede ser negativo");

export const stockProductoSchema = z
  .number({ invalid_type_error: "El stock debe ser un número entero" })
  .int("El stock debe ser un número entero")
  .nonnegative("El stock no puede ser negativo");

export const descuentoSchema = z
  .number({ invalid_type_error: "El descuento debe ser un número" })
  .min(0, "El descuento debe estar entre 0 y 100")
  .max(100, "El descuento debe estar entre 0 y 100");

export const disponibleSchema = z.boolean({
  invalid_type_error: "Disponible debe ser verdadero o falso",
});
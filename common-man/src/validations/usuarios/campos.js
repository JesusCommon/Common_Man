// validations/usuarios/campos.js
import { z } from "zod";

const NOMBRE_REGEX = /^[A-Za-zÀ-ÿñÑ\s]+$/;
const TELEFONO_REGEX = /^\+?[0-9]{7,15}$/;
const USERNAME_REGEX = /^[A-Za-z0-9_]+$/;
const PASSWORD_SIMBOLO_REGEX = /[!@#$%&(),.?":{}|<>_-]/;

// Helper para replicar tu v.title() de Python
function toTitleCase(str) {
  return str
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

// --- Equivalente a UsuarioValidaciones ---

export const nombreSchema = z
  .string()
  .trim()
  .min(2, "El nombre tiene que tener al menos 2 caracteres")
  .regex(NOMBRE_REGEX, "El nombre solo puede llevar letras")
  .transform(toTitleCase);

export const apellidoSchema = z
  .string()
  .trim()
  .min(2, "El apellido tiene que tener al menos 2 caracteres")
  .regex(NOMBRE_REGEX, "El apellido solo puede llevar letras")
  .transform(toTitleCase);

export const telefonoSchema = z
  .string()
  .trim()
  .regex(TELEFONO_REGEX, "Número telefónico inválido");

export const usernameSchema = z
  .string()
  .trim()
  .min(3, "El username tiene que tener mínimo 3 caracteres")
  .regex(USERNAME_REGEX, "El username solo puede llevar letras, número o guión bajo")
  .transform((v) => v.toLowerCase());

export const correoSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("El correo no es válido");

export const bioSchema = z
  .string()
  .trim()
  .max(40, "La bio no puede tener más de 40 caracteres");

export const avatarSchema = z
  .string()
  .url("El avatar debe ser una URL válida")
  .refine(
    (v) => /\.(jpg|jpeg|png|webp)$/i.test(v),
    "El avatar debe ser una URL con extensión .jpg, .jpeg, .png o .webp"
  );

// --- Equivalente a PasswordValidacion ---

export const passwordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .refine((v) => /[A-Z]/.test(v), "La contraseña debe tener al menos una mayúscula")
  .refine((v) => /[a-z]/.test(v), "La contraseña debe tener al menos una minúscula")
  .refine((v) => /\d/.test(v), "La contraseña debe tener al menos un número")
  .refine((v) => !/\s/.test(v), "La contraseña no puede contener espacios")
  .refine((v) => PASSWORD_SIMBOLO_REGEX.test(v), "La contraseña debe tener al menos un símbolo");

// --- Campos numéricos sueltos ---

export const saldoSchema = z
  .number({ invalid_type_error: "El saldo debe ser un número" })
  .positive("El saldo debe ser mayor a 0");

export const montoSchema = z
  .number({ invalid_type_error: "El monto debe ser un número" })
  .positive("El monto debe ser mayor a 0");
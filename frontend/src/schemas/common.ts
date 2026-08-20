import { z } from "zod";

const REGEX = {
  SOLO_LETRAS: /^[A-Za-zÀ-ÿñÑ\s]+$/,
  USERNAME: /^[A-Za-z0-9_]+$/,
  TELEFONO: /^\+?[0-9]{7,15}$/,
  MAYUSCULA: /[A-Z]/,
  MINUSCULA: /[a-z]/,
  NUMERO: /\d/,
  SIMBOLO: /[!@#$%&(),.?":{}|<>_-]/,
  SIN_ESPACIOS: /^\S*$/,
} as const;

export const NombreSchema = z
  .string({ message: "El nombre es obligatorio" })
  .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
  .max(50, { message: "El nombre no puede exceder 50 caracteres" })
  .regex(REGEX.SOLO_LETRAS, { message: "El nombre solo puede contener letras" })
  .transform((v) => v.trim().replace(/\s+/g, " "))
  .transform((v) => v.charAt(0).toUpperCase() + v.slice(1));

 export const ApellidoSchema = z
  .string()
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? v.trim().replace(/\s+/g, " ") : undefined))
  .refine((v) => !v || v.length >= 2, { message: "Mínimo 2 caracteres" })
  .refine((v) => !v || /^[a-zA-ZÀ-ÿ\s]+$/.test(v), { message: "Solo letras" });


export const UsernameSchema = z
  .string({ message: "El username es obligatorio" })
  .min(3, { message: "El username debe tener al menos 3 caracteres" })
  .max(30, { message: "El username no puede exceder 30 caracteres" })
  .regex(REGEX.USERNAME, { message: "El username solo puede contener letras, números o guión bajo" })
  .transform((v) => v.trim().toLowerCase());

export const TelefonoSchema = z
  .string()
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? v.trim() : undefined))
  .refine((v) => !v || /^\+?[0-9\s\-()]{7,15}$/.test(v), { message: "Número inválido" });

export const CorreoSchema = z
  .string({ message: "El correo es obligatorio" })
  .email({ message: "Correo electrónico inválido" })
  .transform((v) => v.trim().toLowerCase());

export const BioSchema = z
  .string({ message: "La bio debe ser texto" })
  .max(280, { message: "La bio no puede tener más de 280 caracteres" })
  .transform((v) => v.trim())
  .optional();

export const AvatarSchema = z
  .string({ message: "El avatar debe ser una URL" })
  .url({ message: "La URL del avatar no es válida" })
  .optional();

export const PasswordSchema = z
  .string({ message: "La contraseña es obligatoria" })
  .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
  .regex(REGEX.MAYUSCULA, { message: "La contraseña debe tener al menos una mayúscula" })
  .regex(REGEX.MINUSCULA, { message: "La contraseña debe tener al menos una minúscula" })
  .regex(REGEX.NUMERO, { message: "La contraseña debe tener al menos un número" })
  .regex(REGEX.SIN_ESPACIOS, { message: "La contraseña no puede contener espacios" })
  .regex(REGEX.SIMBOLO, { message: "La contraseña debe tener al menos un símbolo" });

export const MontoSchema = z
  .union([z.string(), z.number()])
  .transform((v) => (typeof v === "string" ? Number(v) : v))
  .pipe(
    z.number({ message: "El monto debe ser un número válido" })
      .int({ message: "El monto debe ser un número entero" })
      .positive({ message: "El monto debe ser mayor a 0" })
  );

export const RolUsuarioSchema = z.enum(["usuario", "admin"]);
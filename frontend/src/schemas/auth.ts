import { z } from "zod";

export const LoginSchema = z.object({
  identidad: z
    .string({ message: "La identidad es obligatoria" })
    .min(1, "Ingresa tu correo o username")
    .transform((v) => v.trim().toLowerCase()),
    
  password: z
    .string({ message: "La contraseña es obligatoria" })
    .min(1, "Ingresa tu contraseña"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const RefreshSchema = z.object({
  refresh_token: z
    .string({ message: "El token de refresco es obligatorio" })
    .min(1, "Token de refresco inválido"),
});

export type RefreshInput = z.infer<typeof RefreshSchema>;
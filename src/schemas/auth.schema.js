import * as z from "zod";

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Seu e-mail é obrigatório." })
    .trim()
    .min(1, "Seu e-mail é obrigatório.")
    .email("Insira um e-mail válido."),
  password: z
    .string({ required_error: "A senha é obrigatória." })
    .min(6, "A senha deve ter no minimo 6 caracteres.")
    .max(16, "A senha deve ter no máximo 16 caracteres."),
});

export const registerSchema = loginSchema.extend({
  name: z
    .string({ required_error: "Seu nome é obrigatório." })
    .trim()
    .min(3, "Seu nome deve ter no minimo 3 caracteres.")
    .max(30, "Seu nome deve ter no máximo 30 caracteres."),
});

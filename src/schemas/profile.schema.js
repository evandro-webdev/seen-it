import * as z from "zod";
import { USER_COLOR_IDS } from "@/constants/colors";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const profileSchema = z.object({
  name: z
    .string({ required_error: "Seu nome é obrigatório." })
    .trim()
    .min(3, "Seu nome deve ter no minimo 3 caracteres.")
    .max(30, "Seu nome deve ter no máximo 30 caracteres."),
  username: z
    .string({ required_error: "Nome de usuário é obrigatório." })
    .trim()
    .min(3, "O nome de usuário deve ter no mínimo 3 caracteres.")
    .max(20, "O nome de usuário deve ter no máximo 20 caracteres.")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Use apenas letras, números, hífens e underlines (sem espaços ou caracteres especiais).",
    ),
  color: z.enum(USER_COLOR_IDS, {
    errorMap: () => ({ message: "Escolha uma cor válida." }),
  }),
  imageFile: z
    .custom((file) => file instanceof File, { message: "Arquivo inválido." })
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      "A imagem deve ter no máximo 5MB.",
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Formato inválido. Use JPG, PNG ou WEBP.",
    )
    .nullable()
    .optional(),
});
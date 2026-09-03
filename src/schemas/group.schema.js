import * as z from "zod";
import { GROUP_THEME_IDS } from "@/constants/colors.js";

export const createGroupSchema = z.object({
  groupName: z
    .string({ required_error: "O nome do grupo é obrigatório." })
    .trim()
    .min(3, "O nome do grupo deve ter pelo menos 3 caracteres.")
    .max(30, "O nome do grupo deve ter no máximo 30 caracteres."),
  invitedMembers: z
    .array(z.object({ uid: z.string() }))
    .min(1, "Adicione pelo menos 1 membro ao grupo.")
    .max(5, "O grupo só pode ter no máximo 5 pessoas (incluindo você)"),
  theme: z.enum(GROUP_THEME_IDS, {
    errorMap: () => ({ message: "Escolha uma cor válida para o grupo." }),
  }),
});

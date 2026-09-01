import * as z from "zod";

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
  color: z.object({
    primary: z.string(),
    secondary: z.string(),
  }),
});

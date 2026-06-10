import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().min(1, "Email обязателен").email("Неверный формат email"),

    password: z
        .string()
        .min(1, "Пароль обязателен")
        .min(8, "Минимум 8 символов"),
});

export type LoginForm = z.infer<typeof loginSchema>;

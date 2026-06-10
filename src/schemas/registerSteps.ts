import { z } from "zod";

// Шаг 1: Email
export const step1Schema = z.object({
    email: z.string().min(1, "Email обязателен").email("Неверный формат email"),
});

// Шаг 2: Пароль
export const step2Schema = z
    .object({
        password: z
            .string()
            .min(1, "Пароль обязателен")
            .min(8, "Минимум 8 символов")
            .regex(/[A-Za-z]/, "Должна быть хотя бы одна буква")
            .regex(/[0-9]/, "Должна быть хотя бы одна цифра"),
        confirmPassword: z.string().min(1, "Подтвердите пароль"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Пароли не совпадают",
        path: ["confirmPassword"],
    });

// Шаг 3: Имя и телефон
export const step3Schema = z.object({
    name: z
        .string()
        .min(1, "Имя обязательно")
        .min(2, "Минимум 2 символа")
        .max(50, "Максимум 50 символов"),
    phone: z.string().optional(),
});

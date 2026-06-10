import { z } from "zod";

export const petSchema = z.object({
    status: z.enum(["lost", "found"] as const),
    name: z.string().min(1, "Укажите кличку или название"),
    type: z.enum(["dog", "cat", "other"] as const),
    description: z
        .string()
        .min(10, "Описание должно содержать минимум 10 символов"),
    date: z.string().min(1, "Укажите дату"),
    city: z.string().min(1, "Укажите город"),
    image: z.string().nullable().optional(),
    contact_phone: z.string().optional(),
});

export type PetForm = z.infer<typeof petSchema>;

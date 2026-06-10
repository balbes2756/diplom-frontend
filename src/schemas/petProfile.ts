import { z } from "zod";

export const petProfileSchema = z.object({
    name: z.string().min(1, "Введите кличку питомца"),
    type: z.enum(["dog", "cat", "other"], { message: "Выберите тип" }),
    breed: z.string().optional(),
    birthDate: z.string().optional(), // формат YYYY-MM-DD
    color: z.string().optional(),
    avatar: z
        .string()
        .url("Введите корректный URL")
        .optional()
        .or(z.literal("")),
    notes: z.string().optional(),
    isChipped: z.boolean().default(false),
});

export type PetProfileForm = z.infer<typeof petProfileSchema>;

export interface PetProfile {
    id: number;
    owner_id: number;
    name: string;
    type: "dog" | "cat" | "other";
    breed?: string | null;
    birth_date?: string | null; // snake_case (бэкенд)
    color?: string | null;
    avatar?: string | null;
    notes?: string | null;
    is_chipped: boolean; // snake_case (бэкенд)
    chip_number?: string | null;
    created_at: string;
    updated_at: string;
}

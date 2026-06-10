import type { LostPet } from "../types/pet";

export const LOST_PETS_DATA: LostPet[] = [
    {
        id: 1,
        name: "Рекс",
        type: "dog",
        status: "lost",
        description:
            "Доберман, 3 года. Пропал в районе парка. Был в красном ошейнике.",
        date: "15.01.2026",
        city: "Норильск",
        lat: 66.1435,
        long: 85.4211,
    },
    {
        id: 2,
        name: "Муся",
        type: "cat",
        status: "found",
        description: "Найден сфинкс у подъезда. Очень ласковый, ищет хозяев.",
        date: "14.01.2026",
        city: "Норильск",
    },
    {
        id: 3,
        name: "Пушок",
        type: "other",
        status: "lost",
        description: "Белый кролик, пропал во дворе частного дома.",
        date: "13.01.2026",
        city: "Норильск",
    },
    {
        id: 4,
        name: "Бобик",
        type: "dog",
        status: "found",
        description: "Найден хаски у дороги. Ошейника нет, очень голодный.",
        date: "12.01.2026",
        city: "Норильск",
    },
];

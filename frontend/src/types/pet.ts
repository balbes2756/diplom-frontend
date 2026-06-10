export type PetType = "dog" | "cat" | "other";
export type PetStatus = "lost" | "found";

export interface LostPet {
    id: number;
    name: string;
    type: PetType;
    status: PetStatus;
    description: string;
    date: string;
    city: string;
    image?: string;
    lat?: number;
    long?: number;
    user_id?: number;
}

export interface PetCardProps {
    pet: LostPet;
    onClick?: (pet: LostPet) => void;
}

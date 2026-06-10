import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LostPet } from "../types/pet";
import { api } from "../lib/api";
import type { PetProfile, PetProfileForm } from "../schemas/petProfile";

const toBackendFormat = (form: PetProfileForm) => ({
    name: form.name,
    type: form.type,
    breed: form.breed || null,
    birth_date: form.birthDate || null,
    color: form.color || null,
    avatar: form.avatar || null,
    notes: form.notes || null,
    is_chipped: form.isChipped,
    chip_number: null,
});

interface PetState {
    // === ОБЪЯВЛЕНИЯ О ПРОПАЖЕ (LostPet) ===
    pets: LostPet[];
    addPet: (pet: Omit<LostPet, "id">) => void;
    removePet: (id: number) => void;
    updatePet: (id: number, updates: Partial<LostPet>) => void;

    // === ПРОФИЛИ ПИТОМЦЕВ (PetProfile) ===
    petProfiles: PetProfile[];
    isProfilesLoading: boolean;
    profilesError: string | null;
    fetchMyPets: () => Promise<void>;
    addPetProfile: (formData: PetProfileForm) => Promise<void>;
    updatePetProfile: (id: number, formData: PetProfileForm) => Promise<void>;
    deletePetProfile: (id: number) => Promise<void>;
}

export const usePetStore = create<PetState>()(
    persist(
        (set) => ({
            // === ОБЪЯВЛЕНИЯ О ПРОПАЖЕ ===
            pets: [],

            addPet: (pet) =>
                set((state) => ({
                    pets: [
                        {
                            ...pet,
                            id: Date.now(),
                        },
                        ...state.pets,
                    ],
                })),

            removePet: (id) =>
                set((state) => ({
                    pets: state.pets.filter((p) => p.id !== id),
                })),

            updatePet: (id, updates) =>
                set((state) => ({
                    pets: state.pets.map((p) =>
                        p.id === id ? { ...p, ...updates } : p,
                    ),
                })),

            // === ПРОФИЛИ ПИТОМЦЕВ ===
            petProfiles: [],
            isProfilesLoading: false,
            profilesError: null,

            // Загрузка профилей с бэкенда
            fetchMyPets: async () => {
                set({ isProfilesLoading: true, profilesError: null });
                try {
                    const profiles =
                        await api.get<PetProfile[]>("/pets/profile/me");
                    set({ petProfiles: profiles, isProfilesLoading: false });
                } catch (err: any) {
                    set({
                        profilesError: err.message,
                        isProfilesLoading: false,
                    });
                }
            },

            // Добавление нового профиля питомца
            addPetProfile: async (formData: PetProfileForm) => {
                set({ isProfilesLoading: true, profilesError: null });
                try {
                    const payload = toBackendFormat(formData);
                    const newProfile = await api.post<PetProfile>(
                        "/pets/profile",
                        payload,
                    );
                    set((state) => ({
                        petProfiles: [newProfile, ...state.petProfiles],
                        isProfilesLoading: false,
                    }));
                } catch (err: any) {
                    set({
                        profilesError: err.message,
                        isProfilesLoading: false,
                    });
                    throw err;
                }
            },

            // ✅ Обновление профиля (асинхронное, с API)
            updatePetProfile: async (id: number, formData: PetProfileForm) => {
                set({ isProfilesLoading: true, profilesError: null });
                try {
                    const payload = toBackendFormat(formData);
                    const updated = await api.patch<PetProfile>(
                        `/pets/profile/${id}`,
                        payload,
                    );
                    set((state) => ({
                        petProfiles: state.petProfiles.map((p) =>
                            p.id === id ? updated : p,
                        ),
                        isProfilesLoading: false,
                    }));
                } catch (err: any) {
                    set({
                        profilesError: err.message,
                        isProfilesLoading: false,
                    });
                    throw err;
                }
            },

            // ✅ Удаление профиля (асинхронное, с API)
            deletePetProfile: async (id: number) => {
                set({ isProfilesLoading: true, profilesError: null });
                try {
                    await api.delete<void>(`/pets/profile/${id}`);
                    set((state) => ({
                        petProfiles: state.petProfiles.filter(
                            (p) => p.id !== id,
                        ),
                        isProfilesLoading: false,
                    }));
                } catch (err: any) {
                    set({
                        profilesError: err.message,
                        isProfilesLoading: false,
                    });
                    throw err;
                }
            },
        }),
        {
            name: "pets-storage",
            partialize: (state) => ({ pets: state.pets }),
        },
    ),
);

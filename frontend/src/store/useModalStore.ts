import { create } from "zustand";

interface ModalState {
    isRegisterOpen: boolean;
    isLoginOpen: boolean;
    pendingPath: string | null;
    currentStep: number;
    isAddPetOpen: boolean;
    initialStatus?: "lost" | "found";

    openRegister: (navigateTo?: string) => void;
    closeRegister: () => void;
    openLogin: (navigateTo?: string) => void;
    closeLogin: () => void;
    clearPendingPath: () => void;
    setStep: (step: number) => void;
    resetSteps: () => void;
    openAddPet: (status?: "lost" | "found") => void;
    closeAddPet: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
    isRegisterOpen: false,
    isLoginOpen: false,
    pendingPath: null,
    currentStep: 1,
    isAddPetOpen: false,
    initialStatus: "lost",

    openRegister: (navigateTo) =>
        set({
            isRegisterOpen: true,
            isLoginOpen: false,
            pendingPath: navigateTo || null,
            currentStep: 1,
        }),

    closeRegister: () => set({ isRegisterOpen: false }),

    openLogin: (navigateTo) =>
        set({
            isLoginOpen: true,
            isRegisterOpen: false,
            pendingPath: navigateTo || null,
        }),

    closeLogin: () => set({ isLoginOpen: false }),

    openAddPet: (status = "lost") =>
        set({
            isAddPetOpen: true,
            initialStatus: status,
        }),

    closeAddPet: () => set({ isAddPetOpen: false }),

    clearPendingPath: () => set({ pendingPath: null }),

    setStep: (step) => set({ currentStep: step }),

    resetSteps: () => set({ currentStep: 1 }),
}));

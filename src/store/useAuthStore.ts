import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "../lib/api";

// Тип пользователя
interface User {
    id: number;
    email: string;
    name: string;
    phone?: string;
    avatar?: string;
}

// Состояние аутентификации
interface AuthState {
    // Данные
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Действия
    login: (email: string, password: string) => Promise<void>;
    register: (
        email: string,
        password: string,
        name: string,
        phone?: string,
    ) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
    updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            // Начальное состояние
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: true,

            // ВХОД
            login: async (email: string, password: string) => {
                set({ isLoading: true });
                try {
                    // Внимание: Твой бэкенд (routers/auth.py) ожидает схему UserCreate для логина,
                    // которая включает поле name. Передаем пустую строку, чтобы Pydantic не ругался.
                    // В идеале на бэкенде для логина стоит сделать отдельную схему без name.
                    const response = await api.post<{
                        access_token: string;
                        token_type: string;
                    }>("/auth/login", {
                        email,
                        password,
                    });

                    localStorage.setItem("auth_token", response.access_token);
                    set({ token: response.access_token, isLoading: false });

                    // После логина сразу загружаем профиль
                    await useAuthStore.getState().checkAuth();
                } catch (error: any) {
                    set({ isLoading: false });
                    throw error; // Пробрасываем ошибку в компонент (чтобы показать алерт)
                }
            },

            // РЕГИСТРАЦИЯ
            register: async (
                email: string,
                password: string,
                name: string,
                phone?: string,
            ) => {
                set({ isLoading: true });
                try {
                    const response = await api.post<{
                        access_token: string;
                        token_type: string;
                    }>("/auth/register", {
                        email,
                        password,
                        name,
                        phone,
                    });

                    localStorage.setItem("auth_token", response.access_token);
                    set({ token: response.access_token, isLoading: false });

                    await useAuthStore.getState().checkAuth();
                } catch (error: any) {
                    set({ isLoading: false });
                    throw error;
                }
            },

            // ВЫХОД
            logout: () => {
                localStorage.removeItem("auth_token");
                set({ user: null, token: null, isAuthenticated: false });
            },

            checkAuth: async () => {
                console.log("🔍 checkAuth: начинаю проверку...");

                const token = get().token || localStorage.getItem("auth_token");
                console.log("🔑 Token:", token ? "есть" : "нет");

                if (!token) {
                    console.log("⚠️ Нет токена → пользователь не авторизован");
                    set({
                        isAuthenticated: false,
                        user: null,
                        isLoading: false,
                    });
                    return;
                }

                try {
                    console.log("📡 Запрос к /auth/me...");
                    const user = await api.get<User>("/auth/me");
                    console.log("✅ Пользователь получен:", user);
                    set({ user, isAuthenticated: true, isLoading: false });
                } catch (error: any) {
                    console.error("❌ Ошибка checkAuth:", error.message);
                    localStorage.removeItem("auth_token");
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                }
            },

            updateUser: (updates) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...updates } : null,
                })),
        }),
        {
            name: "auth-storage", // Ключ в localStorage
            partialize: (state) => ({
                token: state.token,
            }),
        },
    ),
);

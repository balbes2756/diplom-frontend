import { create } from "zustand";
import { api } from "../lib/api";
import type { Article, ArticleForm } from "../types/article";

interface ArticleState {
    articles: Article[];
    currentArticle: Article | null;
    isLoading: boolean;
    error: string | null;
    fetchArticles: (category?: string) => Promise<void>;
    createArticle: (data: ArticleForm) => Promise<void>;
    fetchArticleById: (id: number) => Promise<void>;
    updateArticle: (id: number, data: Partial<ArticleForm>) => Promise<void>;
    deleteArticle: (id: number) => Promise<void>;
}

export const useArticleStore = create<ArticleState>((set) => ({
    articles: [],
    currentArticle: null,
    isLoading: false,
    error: null,

    fetchArticles: async (category) => {
        set({ isLoading: true, error: null });
        try {
            const url = category
                ? `/articles?category=${category}`
                : "/articles";
            const data = await api.get<Article[]>(url);
            set({ articles: data, isLoading: false });
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
        }
    },

    fetchArticleById: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            const article = await api.get<Article>(`/articles/${id}`);
            set({ currentArticle: article, isLoading: false });
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
        }
    },

    createArticle: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const newArticle = await api.post<Article>("/articles", data);
            set((state) => ({
                articles: [newArticle, ...state.articles],
                isLoading: false,
            }));
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
            throw err;
        }
    },

    updateArticle: async (id: number, data) => {
        set({ isLoading: true, error: null });
        try {
            const updated = await api.patch<Article>(`/articles/${id}`, data);
            set((state) => ({
                articles: state.articles.map((a) =>
                    a.id === id ? updated : a,
                ),
                currentArticle:
                    state.currentArticle?.id === id
                        ? updated
                        : state.currentArticle,
                isLoading: false,
            }));
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
            throw err;
        }
    },

    deleteArticle: async (id) => {
        await api.delete(`/articles/${id}`);
        set((state) => ({
            articles: state.articles.filter((a) => a.id !== id),
            currentArticle:
                state.currentArticle?.id === id ? null : state.currentArticle,
        }));
    },
}));

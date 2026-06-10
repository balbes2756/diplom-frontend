import { create } from "zustand";
import { api } from "../lib/api";

export interface Comment {
    id: number;
    article_id: number;
    user_id: number;
    text: string;
    created_at: string;
    author_name: string;
    author_avatar: string | null;
}

interface CommentState {
    comments: Comment[];
    isLoading: boolean;
    error: string | null;
    fetchComments: (articleId: number) => Promise<void>;
    addComment: (articleId: number, text: string) => Promise<void>;
    editComment: (
        articleId: number,
        commentId: number,
        text: string,
    ) => Promise<void>;
    deleteComment: (articleId: number, commentId: number) => Promise<void>;
}

export const useCommentStore = create<CommentState>((set, get) => ({
    comments: [],
    isLoading: false,
    error: null,

    fetchComments: async (articleId) => {
        set({ isLoading: true, error: null });
        try {
            const data = await api.get<Comment[]>(
                `/articles/${articleId}/comments`,
            );
            set({ comments: data, isLoading: false });
        } catch (err: any) {
            console.error("Ошибка загрузки:", err);
            set({ error: err.message, isLoading: false });
        }
    },

    addComment: async (articleId, text) => {
        try {
            await api.post<Comment>(`/articles/${articleId}/comments`, {
                text,
            });
            await get().fetchComments(articleId);
        } catch (err: any) {
            console.error("Ошибка добавления:", err);
            throw err;
        }
    },

    editComment: async (articleId, commentId, text) => {
        try {
            await api.patch<Comment>(`/articles/comments/${commentId}`, {
                text,
            });
            set((state) => ({
                comments: state.comments.map((c) =>
                    c.id === commentId ? { ...c, text } : c,
                ),
            }));
        } catch (err: any) {
            console.error("Ошибка редактирования:", err);
            throw err;
        }
    },

    deleteComment: async (articleId, commentId) => {
        try {
            await api.delete(`/articles/comments/${commentId}`);
            set((state) => ({
                comments: state.comments.filter((c) => c.id !== commentId),
            }));
        } catch (err: any) {
            console.error("Ошибка удаления:", err);
            throw err;
        }
    },
}));

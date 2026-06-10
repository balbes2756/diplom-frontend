export interface Article {
    id: number;
    title: string;
    content: string;
    image_url: string | null;
    category: string | null;
    author_id: number | null;
    created_at: string;
    updated_at: string;
}

export interface ArticleForm {
    title: string;
    content: string;
    image_url: string;
    category: "news" | "guide" | "discussion";
}
